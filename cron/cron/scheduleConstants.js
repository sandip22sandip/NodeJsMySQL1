'use strict';

let constants = {
    EVERY_30_SECONDS:   '*/1 * * * * *',
    EVERY_MINUTE:       '* * * * *',
    EVERY_30_MINUTES:   '*/30 * * * *',
    EVERY_HOUR:         '0 0 * * * *'
};

module.exports =
    Object.freeze(constants); // freeze prevents changes by users
