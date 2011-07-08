/*!
 * jQuery Sprite Plugin v0.1
 *
 * Copyright 2011, Matt Robenolt
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($){
    
    $.fn.sprite = function(options)
    {
        var config = {
            size: false, // [width, height]
            speed: 200, // delay between frames
            frames: 5,
            mode: 'once', // once, loop, or bounce
            columns: -1 // -1 is unlimited, used to wrap a wide sprite sheet into rows if necessary
            //onComplete: $.noop, // onComplete: function()
            //onStep: $.noop // onStep: function(e)
        },

        KEY = '__sprite__', // data key to detect if the sprite sheet is running or not
        _setTimeout = setTimeout; // shortcut to remove a few bytes when minified

        $.extend(config, options);
        
        function setBackgroundPosition(el, x, y)
        {
            el.style.backgroundPosition = x+'px '+y+'px';
        }
        
        !config.size && (config.size = [this.width(), this.height()]); // try and guess the width and height of the frame if not defined
        
        return this.each(function()
        {
            var t = this,
                step = 1, // start on the second frame, since we're manually setting it to the first frame.
                stepDirection = 1;
            
            // check if sprite is currently running, if so, bail out
            if($(t).data(KEY)) return;
            
            $(t).data(KEY, 1);
            
            // move the background to 0,0 to start
            setBackgroundPosition(t, 0, 0);
            _setTimeout(doStep, config.speed);
            
            function doStep()
            {
                // calculate current column and row to be in based on the current step
                var column = (config.columns > -1) ? step % config.columns : step,
                    row = (config.columns > -1) ? Math.floor(step / config.columns) : 0;
                
                setBackgroundPosition(t, -(column*config.size[0]), -(row*config.size[1]));
                
                typeof config.onStep === 'function' && config.onStep.apply(t, [{column: column, row: row, step: step}]);
                
                switch(config.mode)
                {
                    case 'loop':
                        // if the next step is the last frame, jump back to the beginning
                        if(++step === config.frames)
                        {
                            step = 0;
                        }
                    break;
                    case 'bounce':
                        // if the loop is currently reversed, and the next step is 0, bounce forward
                        if(stepDirection < 0 && --step === 0)
                        {
                            stepDirection = 1;
                            break;
                        }
                        // if the loop is current going forward, and the next step is the last, reverse it.
                        if(++step === config.frames)
                        {
                            stepDirection = -1;
                            step-=2; // subtract two because the we need the frame before (config.frames-1)
                            break;
                        }
                    break;
                    case 'once':
                    default:
                        // if the next step is the last, trigger the onComplete callback
                        if(++step === config.frames)
                        {
                            typeof config.onComplete === 'function' && config.onComplete.apply(t);
                            $(t).removeData(KEY);
                            return;
                        }
                    break;
                }
                
                _setTimeout(doStep, config.speed);
            }
        });
    };
    
}(jQuery));