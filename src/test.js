const two_captcha_api_key = 'fe920f0af037e534bb8180f0dbdec403';
const account = require('./account');

account.create(two_captcha_api_key, null, null, '172.245.214.115', '1080').then(response => {
    console.log(response)
}).catch(function (error) {
    return error;
});