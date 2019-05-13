'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 
    'mongodb://my-new-user:mnu_pw-001@ds127851.mlab.com:27851/swish-stats';

    exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://localhost/swish-stats-test';


exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
