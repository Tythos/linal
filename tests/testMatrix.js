/*
*/

//require(['../linal', 'TestSuite'], function(linal, TestSuite) {
require(['TestSuite'], function(TestSuite) {
    ts = new TestSuite();
    ts.addTest(function testArrays() { return this.assertEach([1,2,3], [1,2,3]); });
    ts.addTest(function() { return true; });
    ts.addTest(function() { return a + b; });
    ts.addTest(function() { return this.assertTolerance(1, 1 + 1e-3, 1e-4)})
    var results = ts.runAll();
    var table = ts.renderResults(document, results);
    document.body.appendChild(table);
});
