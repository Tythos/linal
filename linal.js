/*
*/

define(function(require, exports, module) {
	var vector = {};
	var matrix = {};

	vector.isVector = function(values) {
		var result = Array.isArray(values);
		if (result) {
			values.forEach(function(val,ndx) {
				if (typeof(val) != 'number') {
					result = false;
				}
			})
		}
		return result;
	};
		
	vector.avg = function(v) {
		var sum = 0;
		v.forEach(function(val,ndx) { sum += val; });
		return sum / v.length;
	};
			
	vector.norm = function(v) {
		var sum = 0;
		v.forEach(function(val,ndx) { sum += Math.pow(val,2); });
		return Math.sqrt(sum);
	};
		
	vector.normalize = function(v) {
		var mag = vector.norm(v);
		var values = [];
		v.forEach(function(val,ndx) { values[ndx] = val / mag; });
		return values;
	};
			
	vector.add = function(lhs, rhs) {
		if (!vector.isVector(rhs)) {
			throw Error('RHS of addition operator must be a vector');
		}
		if (lhs.length != rhs.length) {
			throw Error('Addition operands must have identical lengths');
		}
		var values = [];
		lhs.forEach(function(val,ndx) { values[ndx] = val + rhs[ndx]; });
		return values;
	};
			
	vector.sub = function(lhs, rhs) {
		if (!vector.isVector(rhs)) {
			throw Error('RHS of subtraction operator must be a vector');
		}
		if (lhs.length != rhs.length) {
			throw Error('Subtraction operands must have identical lengths');
		}
		var values = [];
		lhs.forEach(function(val,ndx) { values[ndx] = val - rhs[ndx]; });
		return values;
	};

	vector.dot = function(lhs, rhs) {
		if (!vector.isVector(rhs)) {
			throw Error('RHS of dot-product operator must be a vector');
		}
		if (lhs.length != rhs.length) {
			throw Error('Dot-product operands must have identical lengths');
		}
		var result = 0;
		lhs.forEach(function(val,ndx) { result += val * rhs[ndx]; });
		return result;
	};
			
	vector.cross = function(lhs, rhs) {
		if (!vector.isVector(rhs)) {
			throw Error('RHS of cross-product operator must be a vector');
		}
		if (lhs.length != 3 || rhs.length != 3) {
			throw Error('Cross-product operands must have a length of 3');
		}
		return [
			lhs[1] * rhs[2] - rhs[1] * lhs[2],
			lhs[2] * rhs[0] - rhs[2] * lhs[0],
			lhs[0] * rhs[1] - rhs[0] * lhs[1]
		];
	};

	vector.mult = function(lhs, rhs) {
		if (typeof(rhs) != 'number') {
			throw Error('RHS of multiplication operator must be a scalar');
		}
		var values = [];
		lhs.forEach(function(val,ndx) { values[ndx] = val * rhs; });
		return values;
	};
			
	vector.div = function(lhs, rhs) {
		if (typeof(rhs) != 'number') {
			throw Error('RHS of division operator must be a scalar');
		}
		var values = [];
		lhs.forEach(function(val,ndx) { values[ndx] = val / rhs; });
		return values;
	};
			
	vector.pow = function(lhs, rhs) {
		if (typeof(rhs) != 'number') {
			throw Error('RHS of power operator must be a scalar');
		}
		var values = [];
		lhs.forEach(function(val,ndx) { values[ndx] = Math.pow(val, rhs); });
		return values;
	};

	vector.log = function(lhs, rhs) {
		if (typeof(rhs) != 'number') {
			throw Error('RHS of logarithm operator must be a scalar');
		}
		var values = [];
		lhs.forEach(function(val,ndx) { values[ndx] = Math.log(val) / Math.log(rhs); });
		return values;
	};
			
	vector.ewo = function(lhs, op) {
		// Was this supposed to be arbitrary element-wise operation?
		var values = [];
		lhs.forEach(function(val,ndx) { values[ndx] = op(val); });
		return values;
	};
			
	vector.toString = function(lhs) {
		var str = '';
		lhs.forEach(function(val,ndx) { str += (ndx > 0 ? ',' : '') + String(val); });
		return '[' + str + ']';
	};
			
	vector.angle = function(lhs, rhs) {
		if (!vector.isVector(rhs)) {
			throw Error('RHS of angle operator must be a vector');
		}
		if (lhs.length != rhs.length) {
			throw Error('Angle operands must have identical lengths');
		}
		return Math.acos(vector.dot(lhs, rhs) / vector.norm(lhs) / vector.norm(rhs));
	};

	vector.proj = function(lhs, rhs) {
		if (!vector.isVector(rhs)) {
			throw Error('RHS of projection operator must be a vector');
		}
		if (lhs.length != rhs.length) {
			throw Error('Projection operands must have identical lengths');
		}
		return vector.dot(lhs, rhs) / vector.norm(rhs);
	};
			
	vector.isEqual = function(lhs, rhs) {
		if (!vector.isVector(rhs)) { return false; }
		if (lhs.length != rhs.length) { return false; }
		var result = true;
		lhs.forEach(function(val,ndx) {
			if (val != rhs[ndx]) {
				result = false;
			}
		});
		return result;
	};
		
	vector.zeros = function(n) {
		var values = new Array(n);
		values.fill(0);
		return values;
	};

	vector.ones = function(n) {
		var values = new Array(n);
		values.fill(1);
		return values;
	};

	matrix.isMatrix = function(values) {
		var result = Array.isArray(values);
		var length = -1;
		if (result) {
			values.forEach(function(val,ndx) {
				if (!isVector(val)) {
					result = false;
				}
				if (length < 0) {
					length = val.length;
				} else if (length != val.length) {
					result = false;
				}
			})
		}
		return result;
	};
		
	matrix.row = function(lhs, ndx) {
		return lhs[ndx];
	};

	matrix.col = function(lhs, ndx) {
		var values = [];
		lhs.forEach(function(val) {
			values.push(val[ndx]);
		});
		return values;
	};
			
	matrix.shape = function(lhs) {
		var shape = lhs.length > 0 ? [lhs.length, lhs[0].length] : [0,0];
		return shape;
	};
			
	matrix.toString = function(lhs) {
		var str = '';
		lhs.forEach(function(val, ndx) {
			if (Object.keys(val).indexOf('isVector') >= 0) {
				str += (ndx > 0 ? '\n ' : '') + val.toString();
			} else {
				str += (ndx > 0 ? '\n ' : '') + Vector.toString(val);
			}
		});
		return '[' + str + ']';
	};
			
	matrix.setRow = function(lhs, ndx, row) {
		// For now, forbid matrix expansion.
		if (!isVector(row) || (lhs.length > 0 && row.length != lhs[0].length)) {
			throw Error('Row insertion must have identical length to existing rows');
		}
		if (lhs.length < ndx - 1) {
			throw Error('Expansion on row assignment currently not allowed');
		}
		lhs[ndx] = Vector(row);
	};
			
	matrix.setCol = function(lhs, ndx, col) {
		// For now, forbid matrix expansion.
		var sh = matrix.shape(lhs);
		if (!isVector(col) || col.length != sh[0]) {
			throw Error('Column insertion must have identical length to existing columns');
		}
		if (lhs.length > 0 && lhs[0].length < ndx - 1) {
			throw Error('Expansion on column assignment not currently allowed');
		}
		lhs.forEach(function(row, i) {
			row[ndx] = col[i];
		});
	};
			
	matrix.add = function(lhs, rhs) {
		if (!lhs.shape().isEqual(rhs.shape())) {
			throw Error('Matrix addition operands must have identical sizes');
		}
		var rows = [];
		lhs.forEach(function(val, ndx) {
			rows.push(val.add(rhs[ndx]));
		});
		return rows;
	};

	matrix.sub = function(lhs, rhs) {
		if (!lhs.shape().isEqual(rhs.shape())) {
			throw Error('Matrix subtraction operands must have identical sizes');
		}
		var rows = [];
		lhs.forEach(function(val, ndx) {
			rows.push(val.sub(rhs[ndx]));
		});
		return rows;
	};
			
	matrix.copy = function(lhs) {
		// Returns a deep copy of the current matrix values
		var sh = matrix.shape(lhs);
		var rows = [];
		for (var i = 0; i < sh[0]; i++) {
			var row = [];
			for (var j = 0; j < sh[1]; j++) {
				row.push(lhs[i][j]);
			}
			rows.push(row);
		}
		return rows;
	};
			
	matrix.multScalar = function(lhs, rhs) {
		if (typeof(rhs) != 'number') {
			throw Error('Scalar multiplication method requires a scalar operand');
		}
		var M = matrix.copy(lhs);
		var sh = matrix.shape(M);
		for (var i = 0; i < sh[0]; i++) {
			for (var j = 0; j < sh[1]; j++) {
				M[i][j] = rhs * M[i][j];
			}
		}
		return M;
	};
			
	matrix.multVector = function(lhs, rhs) {
		if (!Vector.isVector(rhs)) {
			throw Error('Vector multiplication method requires a vector operand');
		}
		var sh = matrix.shape(lhs);
		if (sh[1] != rhs.length) {
			throw Error('Length of vector operand must match width of matrix');
		}
		var values = [];
		for (var i = 0; i < sh[0]; i++) {
			var row = matrix.row(lhs, i);
			values.push(Vector.dot(row, rhs));
		}
		return values;
	};
			
	matrix.multMatrix = function(lhs, rhs) {
		if (!matrix.isMatrix(rhs)) {
			throw Error('Matrix multiplication method requires a matrix operator');
		}
		if (matrix.shape(lhs)[1] != matrix.shape(rhs)[0]) {
			throw Error('Matrix multiplication operands must have identical inner dimensions');
		}
		var rows = [];
		for (var i = 0; i < matrix.shape(lhs)[0]; i++) {
			var row = [];
			for (var j = 0; j < rhs.shape()[1]; j++) {
				var row = matrix.row(lhs, i);
				var col = matrix.col(rhs, j);
				row.push(Vector.dot(row, col));
			}
			rows.push(row);
		}
		return rows;
	};
			
	matrix.transpose = function(lhs) {
		var s = matrix.shape(lhs);
		var result = matrix.zeros(s[1], s[0]);
		for (var i = 0; i < s[0]; i++) {
			for (var j = 0; j < s[1]; j++) {
				result[j][i] = lhs[i][j];
			}
		}
		return result;
	};
			
	matrix.slice = function(lhs, I0, If, J0, Jf) {
		var sh = [If-I0+1, Jf-J0+1];
		var M = matrix.zeros(sh[0], sh[1]);
		for (var i = I0; i <= If; i++) {
			for (var j = J0; j <= Jf; j++) {
				M[i-I0][j-J0] = lhs[i][j];
			}
		}
		return M;
	};
			
	matrix.inverse = function(lhs) {
		// [[0,1], [1,1.5]] => [[-1.5,1], [1,0]]
		// [[1,0,2], [3,-3,4], [0,3,1]] => [[-5,2,2], [-1,1/3,2/3], [3,-1,-1]]
		// [[1,0,0,1], [0,2,1,2], [2,1,0,1], [2,0,1,4]] => [[-2,-0.5,1,0.5], [1,0.5,0,-0.5], [-8,-1,2,2], [3,0.5,-1,-0.5]]
		var sh = matrix.shape(lhs);
		if (sh[0] != sh[1]) {
			throw Error('Matrix inversion can only take place for square matrices');
		}
		
		// Initialize adjoint matrix
		var AB = matrix.zeros(sh[0], 2 * sh[1]);
		for (var i = 0; i < sh[0]; i++) {
			for (var j = 0; j < sh[1]; j++) {
				AB[i][j] = lhs[i][j];
			}
		}
		for (var i = 0; i < sh[0]; i++) {
			for (var j = sh[1]; j < 2 * sh[1]; j++) {
				AB[i][j] = (i == j - sh[1]) + 0;
			}
		}
		
		// Pivot non-zero diagonals
		for (var i = 0; i < sh[0]; i++) {
			if (AB[i][i] == 0) {
				var ndx = -1;
				for (var ii = i+1; ii < sh[0]; ii++) {
					if (ndx < 0 && AB[ii][i] != 0) {
						ndx = ii;
						break;
					}
				}
				if (ndx < 0) {
					throw Error('Could not find valid pivot for diagonal [' + i + '][' + i + ']');
				}
				var row = matrix.row(AB, i);
				matrix.setRow(AB, i, matrix.row(AB, ndx));
				matrix.setRow(AB, ndx, row);
			}
		}
		
		// Triangular reduction
		for (var i = 0; i < sh[0]; i++) {
			for (var ii = i+1; ii < sh[0]; ii++) {
				var ratio = AB[ii][i] / AB[i][i];
				if (ratio != 0) {
					var row = matrix.row(AB, ii);
					row = matrix.mult(row, 1 / ratio);
					var set = Vector.sub(matrix.row(AB, i), row);
					matrix.setRow(AB, ii, set);
				}
			}
		}
		
		// Normalize triangular edges
		for (var i = 0; i < sh[0]; i++) {
			if (AB[i][i] != 1) {
				var row = matrix.row(AB, i);
				row = Vector.div(row, row[i]);
				matrix.setRow(AB, i, row);
			}
		}
		
		// Upper triangular elimination
		for (var i = sh[0]-1; i >= 0; i--) {
			for (var ii = i-1; ii >= 0; ii--) {
				if (AB[ii][i] != 0) {
					var row = AB.row(i);
					row = matrix.multScalar(row, AB[ii][i]);
					var set = Vector.sub(matrix.row(AB, ii), row);
					matrix.setRow(AB, ii, set);
				}
			}
		}
		return matrix.slice(AB, 0, sh[0]-1, sh[0], 2*sh[0]-1);
	};
			
	matrix.zeros = function(nRows, nCols) {
		if (typeof(nCols) == 'undefined') { nCols = nRows; }
		var rows = [];
		for (var i = 0; i < nRows; i++) {
			var row = [];
			for (var j = 0; j < nCols; j++) {
				row.push(0);
			}
			rows.push(row);
		}
		return rows;
	};
		
	matrix.ones = function(nRows, nCols) {
		if (typeof(nCols) == 'undefined') { nCols = nRows; }
		var rows = [];
		for (var i = 0; i < nRows; i++) {
			var row = [];
			for (var j = 0; j < nCols; j++) {
				row.push(1);
			}
			rows.push(row);
		}
		return rows;
	};
		
	matrix.eyes = function(n) {
		var rows = [];
		for (var i = 0; i < n; i++) {
			var row = [];
			for (var j = 0; j < n; j++) {
				row.push((i == j) + 0);
			}
			rows.push(row);
		}
		return rows;
	};
		
	matrix.rot = {
		x: function(tht_rad) {
			var s = Math.sin(tht_rad);
			var c = Math.cos(tht_rad);
			return [
				[1, 0, 0],
				[0, c, -s],
				[0, s, c] ];
		}, y: function(tht_rad) {
			var s = Math.sin(tht_rad);
			var c = Math.cos(tht_rad);
			return [
				[c, 0, s],
				[0, 1, 0],
				[-s, 0, c] ];
		}, z: function(tht_rad) {
			var s = Math.sin(tht_rad);
			var c = Math.cos(tht_rad);
			return [
				[c, -s, 0],
				[s, c, 0],
				[0, 0, 1] ];
		}
	};
	
	return {
		vector: vector,
		matrix: matrix,
		v: vector,
		m: matrix
	};
});
