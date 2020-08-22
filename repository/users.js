const fs = require(`fs`);
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository")

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository  extends Repository{
  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString("hex")}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    //saved is a password that saved in db in consist of hashed(real password+ salt) + salt
    //suplied is a password that user enter in sigin session
    const [hashed, salt] = saved.split(".");

    const buf = await scrypt(supplied, salt, 64);
    const hashedSupplied = buf.toString("hex");
    return hashed === hashedSupplied;
  }
}

module.exports = new UsersRepository("users.json");
///////[[[]]]
// 1. no refactor
//   async getAll() {
//     // open file called this.filename
//     const contents = await fs.promises.readFile(this.filename, {
//       encoding: "utf8",
//     });
//     // read it's content
//     console.log(contents)

//     // Parse the Comment
//     const data =JSON.parse(contents)
//     // Return the parsed data
//     return data
//   }
