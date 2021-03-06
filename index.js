'use strict';
var player = require('play-sound')({})

class BackgroundMusicPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      music: {
        commands: {
          start: {
            usage: 'Starts background music. Internal use only!',
            lifecycleEvents: [
              'validate',
              'startStream'
            ]
          },
          stop: {
            usage: 'Stops background music. Internal use only!',
            lifecycleEvents: [
              'validate',
              'stopStream'
            ]
          }
        },
        usage: 'Internal use only!',
        lifecycleEvents: [
          'validate'
        ]
      }
    };

    this.hooks = {
      'music:start:startStream': this.startStream.bind(this),
      'before:package:cleanup': this.beforePackageCleanup.bind(this),
      'after:deploy:finalize': this.afterDeployDeploy.bind(this),
      'music:stop:stopStream': this.stopStream.bind(this),
      'music:validate' : this.validate.bind(this),
      'music:start:validate' : this.validate.bind(this),
      'music:stop:validate' : this.validate.bind(this),
    };
  }

  validate() {
    if (!this._triggeredFromHook) {
      throw new Error('Internal use only!')
    }
  }

  beforePackageCleanup() {
    this._triggeredFromHook = true;
    this.serverless.pluginManager.run(['music', 'start']);
  }

  startStream() {
    this.serverless.cli.log('Cue the music!');
    this.audio = player.play(__dirname + '/assets/foo.mp3', function(err){
      if (err) throw err
    })
  }

  afterDeployDeploy() {
    this.serverless.pluginManager.run(['music', 'stop'])
  }

  stopStream() {
    this.serverless.cli.log('Stop the music :(');
    this.audio.kill()
  }
}

module.exports = BackgroundMusicPlugin;
