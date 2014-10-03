require File.expand_path(File.join(File.dirname(__FILE__), "..", "lib", "waveformjson"))

require "test/unit"
require "fileutils"

module Helpers
  def fixture(file)
    File.join(File.dirname(__FILE__), "fixtures", file)
  end  
end

class WaveformTest < Test::Unit::TestCase
  include Helpers
  extend Helpers

  def test_generates_waveform
    assert_equal Waveformjson::DefaultOptions[:width], Waveformjson.generate(fixture("sample.wav")).size
  end

  def test_generates_waveform_from_mono_audio_source_via_peak
    assert_equal Waveformjson::DefaultOptions[:width], Waveformjson.generate(fixture("mono_sample.wav")).size
  end

  def test_generates_waveform_from_mono_audio_source_via_rms
    assert_equal Waveformjson::DefaultOptions[:width], Waveformjson.generate(fixture("mono_sample.wav"), :method => :rms).size
  end

  def test_uses_rms_instead_of_peak
    rms = Waveformjson.generate(fixture("sample.wav"))
    peak = Waveformjson.generate(fixture("sample.wav"), :method => :rms)

    assert peak[44] > rms[43]
  end

  def test_is_900px_wide
    data = Waveformjson.generate(fixture("sample.wav"), :width => 900)
    
    assert_equal 900, data.size
  end

  def test_raises_error_if_not_given_readable_audio_source
    assert_raise(RuntimeError) do
      Waveformjson.generate(fixture("sample.txt"))
    end
  end

  def test_raises_deprecation_exception_if_ruby_audio_fails_to_read_source_file
    begin
      Waveformjson.generate(fixture("sample.txt"))
    rescue RuntimeError => e
      assert_match /Hint: non-WAV files are no longer supported, convert to WAV first using something like ffmpeg/, e.message
    end
  end
end
