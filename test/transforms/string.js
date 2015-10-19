var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe("capitalize", function () {
    var testSchema = hannibal.create({
      type: "string",
      transforms: "toUpperCase"
    });

    it("should turn a number into a upper case string", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("1");
    });

    it("should turn a string into a upper case string", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("HANNIBAL");
    });

    it("should turn an array into a string", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("HANNIBAL,FACE");
    });

    it("should turn an object into a string", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("[OBJECT OBJECT]");
    });
  });
});