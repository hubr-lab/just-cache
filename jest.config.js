/*!
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

module.exports = {
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ["./index.js"],
	coverageDirectory: "coverage",
	modulePaths: ["./index.js"],
	testEnvironment: "node",
	testMatch: ["**/test/**/*.test.js?(x)"],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
		},
	}
};
