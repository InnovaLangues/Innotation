require "./lib/waveformjson/version"

Gem::Specification.new do |s|
  s.name              = "waveformjson"
  s.version           = Waveformjson::VERSION
  s.summary           = "Generate waveform json from audio files"
  s.description       = "Generate waveform json from audio files. Includes a Waveform class for generating waveforms in your code as well as a simple command-line program called 'waveformjson' for generating on the command line."
  s.authors           = ["liufengyun"]
  s.email             = ["liufengyunchina@gmail.com"]
  s.homepage          = "http://github.com/liufengyun/waveformjson"

  s.files = Dir[
    "LICENSE",
    "README.md",
    "Rakefile",
    "lib/**/*.rb",
    "*.gemspec",
    "test/**/*.rb",
    "bin/*"
  ]

  s.executables = "waveformjson"

  s.add_dependency "ruby-audio"
end
