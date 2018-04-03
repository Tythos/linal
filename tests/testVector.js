    /*
*/

require(['../linal', 'TestSuite'], function(linal, TestSuite) {
    var ts = new TestSuite();
    ts.addTest(function testIsVector() {
        return linal.vector.isVector([1,2,3]); });
    ts.addTest(function testIsNotVector() {
        return !linal.vector.isVector(1); });
    ts.addTest(function testAvg() {
        return linal.vector.avg([1,2,3]) == 2; });
    ts.addTest(function testNorm() {
        return this.assertTolerance(linal.vector.norm([1,1]), Math.sqrt(2)); });
    ts.addTest(function testNormalize() {
        var hr2 = 0.5 * Math.sqrt(2);
        return this.assertVector(linal.vector.normalize([1,1]), [hr2,hr2]); });

    var results = ts.runAll();
    document.body.appendChild(ts.renderResults(document, results));
});
