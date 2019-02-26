var player = require('play-sound')(opts = {})



var audio = player.play('./assets/foo.mp3', function(err){
  if (err && !err.killed) throw err
})


setTimeout(() => audio.kill(), 3000)