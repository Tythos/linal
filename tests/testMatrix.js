/*
*/

require(['../linal', 'TestSuite'], function(linal, TestSuite) {
    var A = [[1,2,3], [4,5,6]];
    var B = [[7,8,9], [0,-1,-2], [-3,-4,-5]];
    var C = [[0,0,0], [1,1,1]];

    ts = new TestSuite();
    ts.addTest(function testIsMatrix() {
        return linal.M.isMatrix(A); });
    ts.addTest(function testIsNotMatrix() {
        return !linal.M.isMatrix([1, [2,3]]); });
    ts.addTest(function testRow() {
        return this.assertVector(linal.M.row(A, 0), [1,2,3]); });
    ts.addTest(function testCol() {
        return this.assertVector(linal.M.col(A, 0), [1,4]); });
    ts.addTest(function testShape() {
        return this.assertVector(linal.M.shape(A), [2,3]); });
    ts.addTest(function testToString() {
        return this.assertStringI(linal.M.toString(A), "[[1,2,3],\n [4,5,6]]"); });
    ts.addTest(function testSetRow() {
        var A_ = linal.M.copy(A);
        return this.assertMatrix(linal.M.setRow(A_, 0, [1.1,2.2,3.3]), [[1.1,2.2,3.3], [4,5,6]]); });
    ts.addTest(function testSetCol() {
        var A_ = linal.M.copy(A);
        return this.assertMatrix(linal.M.setCol(A_, 0, [1.1, 4.4]), [[1.1,2,3], [4.4,5,6]]); });
    ts.addTest(function testAdd() {
        return this.assertMatrix(linal.M.add(A, C), [[1,2,3], [5,6,7]]); });
    ts.addTest(function testSub() {
        return this.assertMatrix(linal.M.sub(A, C), [[1,2,3], [3,4,5]]); });
    ts.addTest(function testCopy() {
        return this.assertMatrix(linal.M.copy(A), [[1,2,3], [4,5,6]]); });
    ts.addTest(function testCopyDeep() {
        var A_ = linal.M.copy(A);
        A_[0][0] = -1;
        return A[0][0] != A_[0][0]; });
    ts.addTest(function testMultScalar() {
        return this.assertMatrix(linal.M.multScalar(A, 2), [[2,4,6], [8,10,12]]); });
    ts.addTest(function testMultVector() {
        return this.assertVector(linal.M.multVector(A, [0,0,1]), [3,6]); });
    ts.addTest(function testMultMatrix() {
        var P = linal.M.multMatrix(A, B);
        return this.assertMatrix(P, [[-2, -6, -10], [10, 3, -4]]); });
    ts.addTest(function testTranspose() {
        var T = linal.M.transpose(A);
        return this.assertMatrix(T, [[1,4], [2,5], [3,6]]); });
    ts.addTest(function testSlice() {
        var B_ = linal.M.slice(B, 0, 1, 1, 2);
        return this.assertMatrix(B_, [[8,9], [-1,-2]]); });
    ts.addTest(function testInverse1() {
        // [[0,1], [1,1.5]] => [[-1.5,1], [1,0]]
        var M = [[0,1], [1,1.5]];
        var Mi = [[-1.5,1], [1,0]];
        return this.assertMatrix(linal.M.inverse(M), Mi, 1e-4); });
    ts.addTest(function testInverse2() {
        // [[1,0,2], [3,-3,4], [0,3,1]] => [[-5,2,2], [-1,1/3,2/3], [3,-1,-1]]
        var M = [[1,0,2], [3,-3,4], [0,3,1]];
        var Mi = [[-5,2,2], [-1,1/3,2/3], [3,-1,-1]];
        return this.assertMatrix(linal.M.inverse(M), Mi, 1e-4); });
    ts.addTest(function testInverse3() {
        // [[1,0,0,1], [0,2,1,2], [2,1,0,1], [2,0,1,4]] => [[-2,-0.5,1,0.5], [1,0.5,0,-0.5], [-8,-1,2,2], [3,0.5,-1,-0.5]]
        var M = [[1,0,0,1], [0,2,1,2], [2,1,0,1], [2,0,1,4]];
        var Mi = [[-2,-0.5,1,0.5], [1,0.5,0,-0.5], [-8,-1,2,2], [3,0.5,-1,-0.5]];
        return this.assertMatrix(linal.M.inverse(M), Mi, 1e-4); });
    ts.addTest(function testZeros() {
        var Z = [[0,0,0], [0,0,0]];
        var Z_ = linal.M.zeros(2, 3);
        return Z_.every(function(row, ndx) {
            return this.assertEach(row, Z[ndx]); }, this); });
    ts.addTest(function testOnes() {
        return this.assertMatrix(linal.M.ones(2, 3), [[1,1,1], [1,1,1]]); });
    ts.addTest(function testEyes() {
        return this.assertMatrix(linal.M.eyes(3), [[1,0,0], [0,1,0], [0,0,1]]); });
    ts.addTest(function testRotX() {
        var RX = linal.M.rot.x(0.5 * Math.PI);
        return this.assertMatrix(RX, [[1,0,0], [0,0,-1], [0,1,0]]); });
    ts.addTest(function testRotY() {
        var RY = linal.M.rot.y(0.5 * Math.PI);
        return this.assertMatrix(RY, [[0,0,1], [0,1,0], [-1,0,0]]); });
    ts.addTest(function testRotZ() {
        var RZ = linal.M.rot.z(0.5 * Math.PI);
        return this.assertMatrix(RZ, [[0,-1,0], [1,0,0], [0,0,1]]); });
    ts.addTest(function testRotXApply() {
        var RX = linal.M.rot.x(0.5 * Math.PI);
        var y_ = linal.M.multVector(RX, [0,1,0]);
        return this.assertVector(y_, [0,0,1]); });
    ts.addTest(function testRotYApply() {
        var RY = linal.M.rot.y(0.5 * Math.PI);
        var z_ = linal.M.multVector(RY, [0,0,1]);
        return this.assertVector(z_, [1,0,0]); });
    ts.addTest(function testRotZApply() {
        var RZ = linal.M.rot.z(0.5 * Math.PI);
        var x_ = linal.M.multVector(RZ, [1,0,0]);
        return this.assertVector(x_, [0,1,0]); });
                    
    // We need to make sure multiplication is handled/organized consistently between vector and matrix operands

    var results = ts.runAll();
    document.body.appendChild(ts.renderResults(document, results));
});
