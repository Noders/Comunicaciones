const fs = require('fs');
const mkdirp = require('mkdirp');
const meetup = require(`../data/${process.argv[3]}`);

const generateEmail = (type, date) => {
  let template = fs.readFileSync(`${__dirname}/../templates/${type}-meetup.md`, 'utf8');
  for(let i = 0, keys = Object.keys(meetup), len = keys.length; i < len; i++) {
    if(typeof meetup[keys[i]] === 'object') {
      if(keys[i] === 'talks') {
        const talks = [];
        meetup[keys[i]].forEach((talk, k) => {
          talks.push(`- ${talk.type}: **${talk.title}**, [${talk.speaker}](${talk.url})`);
          if(typeof talk.slidesUrl != 'undefined'){
            talks[k] += `, puedes ver las [slides aquí](${talk.slidesUrl})`;
          }
        });

        template = template.replace(`%talks%`, talks.join('\n'));
      } else {
        for(let j = 0, subKeys = Object.keys(meetup[keys[i]]), subLen = subKeys.length; j < subLen; j++) {
          template = template.replace(`%${keys[i]}.${subKeys[j]}%`, meetup[keys[i]][subKeys[j]]);
        } 
      }
    } else {
      if(typeof keys[i] !== 'undefined') {
        template = template.replace(`%${keys[i]}%`, meetup[keys[i]]);
      }
    }
  }
  saveEmail(template);
}

const saveEmail = (content) => {
  const pathParams = process.argv[3].split('-');
  mkdirp(`${__dirname}/../emails/${pathParams[0]}/${pathParams[1]}`, (err) => {
    if (err) throw err;
    fs.writeFileSync(`${__dirname}/../emails/${pathParams[0]}/${pathParams[1]}/${process.argv[2]}-meetup.md`, content, {encoding: 'utf8'});
    console.log('Email creado!');
  });
};

generateEmail(process.argv[2], process.argv[3]);
