# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = 'main'
  spec.version       = '0.3.1'
  spec.author        = 'pipelinit'

  spec.required_ruby_version = '>= 2.5.0'

  spec.summary       = 'Aplicação para gerar'
  spec.description   = 'Aplicação para gerar'

  spec.add_development_dependency 'bundler', '>= 1.16'
  spec.add_development_dependency 'rubocop', '~> 1.22'
end
