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
    ts.addTest(function testAdd() {
        return this.assertVector(linal.vector.add([1,2,3], [2,3,4]), [3,5,7]); });
    ts.addTest(function testSub() {
        return this.assertVector(linal.vector.sub([1,2,3], [2,3,4]), [-1,-1,-1]); });
    ts.addTest(function testDot() {
        return this.assertTolerance(linal.vector.dot([1,2,3], [2,3,4]), 20); });
    ts.addTest(function testCross() {
        return this.assertVector(linal.vector.cross([1,2,3], [2,3,4]), [-1,2,-1]); });
    ts.addTest(function testMult() {
        return this.assertVector(linal.vector.mult([1,2,3], 4), [4,8,12]); });
    ts.addTest(function testDiv() {
        return this.assertVector(linal.vector.div([1,2,3], 2), [0.5, 1.0, 1.5]); });
    ts.addTest(function testPow() {
        return this.assertVector(linal.vector.pow([1,2,3], 2), [1,4,9]); });
    ts.addTest(function testLogNatural() {
        return this.assertVector(linal.vector.log([1,2,3]), [Math.log(1),Math.log(2),Math.log(3)]); });
    ts.addTest(function testLogBase10() {
        return this.assertVector(linal.vector.log([1,10,100], 10), [0,1,2]); });
    ts.addTest(function testElWiseMult() {
        return this.assertVector(linal.vector.elwise.mult([1,2,3], [2,3,4]), [2,6,12]); });
    ts.addTest(function testElWiseDiv() {
        return this.assertVector(linal.vector.elwise.div([1,2,3], [2,3,4]), [0.5, 2/3, 0.75]); });
    ts.addTest(function testToString() {
        return this.assertStringI(linal.vector.toString([1,2,3]), "[1,2,3]"); });
    ts.addTest(function testAngle() {
        return this.assertTolerance(linal.vector.angle([1,0,0], [0,1,0]), 0.5 * Math.PI); });
    ts.addTest(function testProj() {
        return this.assertVector(linal.vector.proj([2,2,0], [1,0,0]), [2,0,0]); });
    ts.addTest(function testEqual() {
        return linal.vector.isEqual([1,2,3], [1.0,2.0,3.0]); });
    ts.addTest(function testNotEqual() {
        return !linal.vector.isEqual([1,2,3], [1.1,2.2,3.3]); });
    ts.addTest(function testZeros() {
        return this.assertEach(linal.vector.zeros(3), [0,0,0]); });
    ts.addTest(function testOnes() {
        return this.assertVector(linal.vector.ones(3), [1,1,1]); });
    var results = ts.runAll();
    document.body.appendChild(ts.renderResults(document, results));
});
