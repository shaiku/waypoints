export { message, text4, text5, text6, text7, text, generateRandomName };

const text = "§e●•··········································•●•·········································•●§r";
const text2 = "⬤●·············●⬤●·············●⬤"
const text3 = '●•····························• ◈ •·········•●'
const text4 = '§8●•·················•● ❖ ●•·················•●';
const text5 = '§c⤛ %chetty.option.tap.teleport ⤜';
const text6 = '§c⤛ %chetty.option.tap.delete ⤜';
const text7 = '§c⤛ %chetty.option.tap.edit ⤜';

function message(source, message) {
   source.playSound("random.orb");
   source.sendMessage(message);
}

function generateRandomName() {
   const vowels = 'aeiou';
   const consonants = 'bcdfghjklmnpqrstvwxyz';
   let name = '';
   const nameLength = Math.floor(Math.random() * 5) + 6;
   for (let i = 0; i < nameLength; i++) {
      if (i % 2 === 0) {
         name += consonants[Math.floor(Math.random() * consonants.length)];
      } else { name += vowels[Math.floor(Math.random() * vowels.length)]; }
   }
   name = name.charAt(0).toUpperCase() + name.slice(1);
   return name;
}