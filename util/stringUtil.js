const generator = require('generate-password');
const validator = require('validator')

module.exports = {
  generateCode: (prefix, digit) => {
    const str = `${prefix}-x`;

    return str.replace('x', makeCode(digit));
  },
  generatePassword: () => {
    return generator.generate({
      length: 8,
      numbers: true
    });
  },
  isEmail:(text) =>{
    return validator.isEmail(text)
  },
  isJson:(text) =>{
    return validator.isJSON(text)
  }
};

function makeCode(digit) {
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < digit; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
