exports.ValidationService = class {
  static async run(field, obj) {
    let errors = {};
    for (let [key, rules] of Object.entries(field)) {
      if (errors[key]) continue;
      const reversedArray = rules.reverse();
      for (let rule of reversedArray) {
        const func = rule[0];
        const error = rule[1];
        const result = await Promise.resolve(func(obj[key]));
        if (result) errors[key] = error;
      }
    }

    return errors;
  }
};
