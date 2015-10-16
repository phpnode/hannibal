var expect = require("expect.js");
var hannibal = require("../../index");

describe("validators", function () {

  var schema = {
    type: "string",
    pre: "addSmith",
    validators: {
      checkName: "Mad Dog Murdoch"
    }
  };

  var additions = {
    pre: {
      addSmith: function (value) {
        if (value === "Hannibal") {
          return value + " Smith";
        } else {
          return value;
        }
      }
    },
    validators: {
      string: {
        checkName: function (attrs, value) {
          if (value === attrs) {
            throw new Error("checkName failed");
          }
        }
      }
    }
  };

  describe("registered", function () {
    var testSchema = hannibal(schema, additions);

    it("should validate Hannibal", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Hannibal Smith");
    });

    it("should fail to validate if too short", function () {
      var output = testSchema("Mad Dog Murdoch");

      expect(output.isValid).to.be(false);
      expect(output.error).to.be.an("object").and.have.keys("checkName");
    });
  });
});