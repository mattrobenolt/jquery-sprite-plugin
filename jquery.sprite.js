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
        $.fn.sprite.defaults = {
            size: [40, 40], // [width, height]
            speed: 200, // delay between frames
            frames: 5,
            mode: 'once', // once, loop, or bounce
            columns: -1, // -1 is unlimited, used to wrap a wide sprite sheet into rows if necessary
            onComplete: $.noop
        };

        var o = $.extend({}, $.fn.sprite.defaults, options);
        
        function setBackgroundPosition(el, p)
        {
            el.style.backgroundPosition = p.x+'px '+p.y+'px';
        }
        
        return this.each(function()
        {
            var t = this,
                step = 1, // start on the second frame, since we're manually setting it to the first frame.
                stepDirection = 1;
            
            // move the background to 0,0 to start
            setBackgroundPosition(t, {x:0, y:0});
            setTimeout(doStep, o.speed);
            
            function doStep()
            {
                // calculate current column and row to be in based on the current step
                var column = (o.columns > -1) ? step % o.columns : step,
                    row = (o.columns > -1) ? Math.floor(step / o.columns) : 0;
                
                setBackgroundPosition(t, {x: -(column*o.size[0]), y: -(row*o.size[1])});
                
                switch(o.mode)
                {
                    case 'loop':
                        // if the next step is the last frame, jump back to the beginning
                        if(++step === o.frames)
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
                        if(stepDirection > 0 && ++step === o.frames)
                        {
                            stepDirection = -1;
                            step-=2; // subtract two because the we need the frame before (o.frames-1)
                            break;
                        }
                    break;
                    case 'once':
                    default:
                        // if the next step is the last, trigger the onComplete callback
                        if(++step === o.frames)
                        {
                            typeof o.onComplete === 'function' && o.onComplete.apply(t);
                            return;
                        }
                    break;
                }
                
                setTimeout(doStep, o.speed);
            }
        });
    };
    
}(jQuery));