require File.join(File.dirname(__FILE__), "waveformjson/version")

require "ruby-audio"

class Waveformjson
  DefaultOptions = {
    :method => :peak,
    :width => 1800,
    :logger => nil
  }
  
  attr_reader :source
  
  class << self    
    # Generate a Waveform image at the given filename with the given options.
    # 
    # Available options (all optional) are:
    # 
    #   :method => The method used to read sample frames, available methods
    #     are peak and rms. peak is probably what you're used to seeing, it uses
    #     the maximum amplitude per sample to generate the waveform, so the
    #     waveform looks more dynamic. RMS gives a more fluid waveform and
    #     probably more accurately reflects what you hear, but isn't as
    #     pronounced (typically).
    #     
    #     Can be :rms or :peak
    #     Default is :peak.
    # 
    #   :width => The width (in pixels) of the final waveform image.
    #     Default is 1800.
    #
    #   :logger => IOStream to log progress to.
    #
    # Example:
    #   Waveformjson.generate("Kickstart My Heart.wav")
    #   Waveformjson.generate("Kickstart My Heart.wav", :method => :rms)
    #   Waveformjson.generate("Kickstart My Heart.wav", :logger => $stdout)
    #
    def generate(source, options={})
      options = DefaultOptions.merge(options)
      
      raise ArgumentError.new("No source audio filename given, must be an existing sound file.") unless source
      raise RuntimeError.new("Source audio file '#{source}' not found.") unless File.exist?(source)

      @log = Log.new(options[:logger])
      @log.start!
      
      # Frames gives the amplitudes for each channel, for our waveform we're
      # saying the "visual" amplitude is the average of the amplitude across all
      # the channels. This might be a little weird w/ the "peak" method if the
      # frames are very wide (i.e. the image width is very small) -- I *think*
      # the larger the frames are, the more "peaky" the waveform should get,
      # perhaps to the point of inaccurately reflecting the actual sound.
      samples = frames(source, options[:width], options[:method]).collect do |frame|
        frame.inject(0.0) { |sum, peak| sum + peak } / frame.size
      end

      samples
    end
    
    private
    
    # Returns a sampling of frames from the given RubyAudio::Sound using the
    # given method the sample size is determined by the given pixel width --
    # we want one sample frame per horizontal pixel.
    def frames(source, width, method = :peak)
      raise ArgumentError.new("Unknown sampling method #{method}") unless [ :peak, :rms ].include?(method)
      
      frames = []

      RubyAudio::Sound.open(source) do |audio|
        frames_read = 0
        frames_per_sample = (audio.info.frames.to_f / width.to_f).floor
        sample = RubyAudio::Buffer.new("float", frames_per_sample, audio.info.channels)

        @log.timed("Sampling #{frames_per_sample} frames per sample: ") do
          while(frames_read = audio.read(sample)) > 0
            frames << send(method, sample, audio.info.channels)
            @log.out(".")
          end
        end
      end
      
      frames
    rescue RubyAudio::Error => e
      raise e unless e.message == "File contains data in an unknown format."
      raise RuntimeError.new("Source audio file #{source} could not be read by RubyAudio library -- Hint: non-WAV files are no longer supported, convert to WAV first using something like ffmpeg (RubyAudio: #{e.message})")
    end
  
    # Returns an array of the peak of each channel for the given collection of
    # frames -- the peak is individual to the channel, and the returned collection
    # of peaks are not (necessarily) from the same frame(s).
    def peak(frames, channels=1)
      peak_frame = []
      (0..channels-1).each do |channel|
        peak_frame << channel_peak(frames, channel)
      end
      peak_frame
    end

    # Returns an array of rms values for the given frameset where each rms value is
    # the rms value for that channel.
    def rms(frames, channels=1)
      rms_frame = []
      (0..channels-1).each do |channel|
        rms_frame << channel_rms(frames, channel)
      end
      rms_frame
    end
  
    # Returns the peak voltage reached on the given channel in the given collection
    # of frames.
    # 
    # TODO: Could lose some resolution and only sample every other frame, would
    # likely still generate the same waveform as the waveform is so comparitively
    # low resolution to the original input (in most cases), and would increase
    # the analyzation speed (maybe).
    def channel_peak(frames, channel=0)
      peak = 0.0
      frames.each do |frame|
        next if frame.nil?
        frame = Array(frame)
        peak = frame[channel].abs if frame[channel].abs > peak
      end
      peak
    end

    # Returns the rms value across the given collection of frames for the given
    # channel.
    def channel_rms(frames, channel=0)
      Math.sqrt(frames.inject(0.0){ |sum, frame| sum += (frame ? Array(frame)[channel] ** 2 : 0) } / frames.size)
    end
  end
end

class Waveformjson
  # A simple class for logging + benchmarking, nice to have good feedback on a
  # long batch operation.
  # 
  # There's probably 10,000,000 other bechmarking classes, but writing this was
  # easier than using Google.
  class Log
    attr_accessor :io

    def initialize(io=$stdout)
      @io = io
    end

    # Prints the given message to the log
    def out(msg)
      io.print(msg) if io
    end

    # Prints the given message to the log followed by the most recent benchmark
    # (note that it calls .end! which will stop the benchmark)
    def done!(msg="")
      out "#{msg} (#{self.end!}s)\n"
    end

    # Starts a new benchmark clock and returns the index of the new clock.
    # 
    # If .start! is called again before .end! then the time returned will be
    # the elapsed time from the next call to start!, and calling .end! again
    # will return the time from *this* call to start! (that is, the clocks are
    # LIFO)
    def start!
      (@benchmarks ||= []) << Time.now
      @current = @benchmarks.size - 1
    end

    # Returns the elapsed time from the most recently started benchmark clock
    # and ends the benchmark, so that a subsequent call to .end! will return
    # the elapsed time from the previously started benchmark clock.
    def end!
      elapsed = (Time.now - @benchmarks[@current])
      @current -= 1
      elapsed
    end

    # Returns the elapsed time from the benchmark clock w/ the given index (as
    # returned from when .start! was called).
    def time?(index)
      Time.now - @benchmarks[index]
    end

    # Benchmarks the given block, printing out the given message first (if
    # given).
    def timed(message=nil, &block)
      start!
      out(message) if message
      yield
      done!
    end
  end
end    
