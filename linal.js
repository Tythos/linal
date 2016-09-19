var isExt = typeof(module) == 'undefined';
if (isExt) { var module = {}; }
module.exports = (function() {
	function isVector(values) {
		var result = Array.isArray(values);
		if (result) {
			values.forEach(function(val,ndx) {
				if (typeof(val) != 'number') {
					result = false;
				}
			})
		}
		return result;
	}
	
	function isMatrix(values) {
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
	}
	
	function Vector(values) {
		if (!isVector(values)) {
			throw Error('Vector must be a 1d Array with numeric values');
		}
		
		values.avg = function() {
			var sum = 0;
			this.forEach(function(val,ndx) { sum += val; });
			return sum / this.length;
		};
		
		values.norm = function() {
			var sum = 0;
			this.forEach(function(val,ndx) { sum += Math.pow(val,2); });
			return Math.sqrt(sum);
		};
		
		values.normalize = function() {
			var mag = this.norm();
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = val / mag; });
			return Vector(values);
		};
		
		values.add = function(rhs) {
			if (!isVector(rhs)) {
				throw Error('RHS of addition operator must be a vector');
			}
			if (this.length != rhs.length) {
				throw Error('Addition operands must have identical lengths');
			}
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = val + rhs[ndx]; });
			return Vector(values);
		};
		
		values.sub = function(rhs) {
			if (!isVector(rhs)) {
				throw Error('RHS of subtraction operator must be a vector');
			}
			if (this.length != rhs.length) {
				throw Error('Subtraction operands must have identical lengths');
			}
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = val - rhs[ndx]; });
			return Vector(values);
		};

		values.dot = function(rhs) {
			if (!isVector(rhs)) {
				throw Error('RHS of dot-product operator must be a vector');
			}
			if (this.length != rhs.length) {
				throw Error('Dot-product operands must have identical lengths');
			}
			var result = 0;
			this.forEach(function(val,ndx) { result += val * rhs[ndx]; });
			return result;
		};
		
		values.cross = function(rhs) {
			if (!isVector(rhs)) {
				throw Error('RHS of cross-product operator must be a vector');
			}
			if (this.length != 3 || rhs.length != 3) {
				throw Error('Cross-product operands must have a length of 3');
			}
			return Vector([
				this[1] * rhs[2] - rhs[1] * this[2],
				this[2] * rhs[0] - rhs[2] * this[0],
				this[0] * rhs[1] - rhs[0] * this[1]
			]);
		};

		values.mult = function(rhs) {
			if (typeof(rhs) != 'number') {
				throw Error('RHS of multiplication operator must be a scalar');
			}
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = val * rhs; });
			return Vector(values);
		};
		
		values.div = function(rhs) {
			if (typeof(rhs) != 'number') {
				throw Error('RHS of division operator must be a scalar');
			}
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = val / rhs; });
			return Vector(values);
		};
		
		values.pow = function(rhs) {
			if (typeof(rhs) != 'number') {
				throw Error('RHS of power operator must be a scalar');
			}
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = Math.pow(val, rhs); });
			return Vector(values);
		};

		values.log = function(rhs) {
			if (typeof(rhs) != 'number') {
				throw Error('RHS of logarithm operator must be a scalar');
			}
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = Math.log(val) / Math.log(rhs); });
			return Vector(values);
		};
		
		values.ewo = function(op) {
			var values = [];
			this.forEach(function(val,ndx) { values[ndx] = op(val); });
			return Vector(values);
		};
		
		values.toString = function() {
			var str = '';
			this.forEach(function(val,ndx) { str += (ndx > 0 ? ',' : '') + String(val); });
			return '[' + str + ']';
		};
		
		values.angle = function(rhs) {
			if (!isVector(rhs)) {
				throw Error('RHS of angle operator must be a vector');
			}
			if (this.length != rhs.length) {
				throw Error('Angle operands must have identical lengths');
			}
			return Math.acos(this.dot(rhs) / this.norm() / rhs.norm());
		};

		values.proj = function(rhs) {
			if (!isVector(rhs)) {
				throw Error('RHS of projection operator must be a vector');
			}
			if (this.length != rhs.length) {
				throw Error('Projection operands must have identical lengths');
			}
			return this.dot(rhs) / rhs.norm();
		};
		
		values.isEqual = function(rhs) {
			if (!isVector(rhs)) { return false; }
			if (this.length != rhs.length) { return false; }
			var result = true;
			this.forEach(function(val,ndx) {
				if (val != rhs[ndx]) {
					result = false;
				}
			});
			return result;
		};
		
		values.isVector = true;

		return values;
	}
	
	Vector.zeros = function(n) {
		var values = [];
		for (var i = 0; i < n; i++) {
			values[i] = 0;
		}
		return Vector(values);
	}

	Vector.ones = function(n) {
		var values = [];
		for (var i = 0; i < n; i++) {
			values[i] = 1;
		}
		return Vector(values);
	}
	
	function Matrix(values) {
		// Indexed by [row #][col #], so storage is an Array of row vectors
		if (isVector(values)) {
			var newVal = [];
			values.forEach(function(val,ndx) {
				newVal.push([val]);
			});
			values = newVal;
		} else if (!isMatrix(values)) {
			throw Error('Matrix must be Array of 1d Arrays, each with numeric values of identical length');
		}
		for (var i = 0; i < values.length; i++) {
			values[i] = Vector(values[i]);
		}
		
		values.row = function(ndx) {
			return Vector(this[ndx]);
		};
		
		values.col = function(ndx) {
			var values = [];
			this.forEach(function(val) {
				values.push(val[ndx]);
			});
			return Vector(values);
		};
		
		values.shape = function() {
			var shape = this.length > 0 ? [this.length, this[0].length] : [0,0];
			return Vector(shape);
		};
		
		values.toString = function() {
			var str = '';
			this.forEach(function(val,ndx) {
				if (Object.keys(val).indexOf('isVector') >= 0) {
					str += (ndx > 0 ? '\n ' : '') + val.toString();
				} else {
					str += (ndx > 0 ? '\n ' : '') + Vector(val).toString();
				}
			});
			return '[' + str + ']';
		};
		
		values.setRow = function(ndx, row) {
			// For now, forbid matrix expansion.
			if (!isVector(row) || (this.length > 0 && row.length != this[0].length)) {
				throw Error('Row insertion must have identical length to existing rows');
			}
			if (this.length < ndx - 1) {
				throw Error('Expansion on row assignment currently not allowed');
			}
			this[ndx] = Vector(row);
		};
		
		values.setCol = function(ndx, col) {
			// For now, forbid matrix expansion.
			var sh = this.shape();
			if (!isVector(col) || col.length != sh[0]) {
				throw Error('Column insertion must have identical length to existing columns');
			}
			if (this.length > 0 && this[0].length < ndx - 1) {
				throw Error('Expansion on column assignment not currently allowed');
			}
			this.forEach(function(row, i) {
				row[ndx] = col[i];
			});
		};
		
		values.add = function(rhs) {
			if (Object.keys(rhs).indexOf('isMatrix') < 0) {
				rhs = Matrix(rhs);
			}
			if (!this.shape().isEqual(rhs.shape())) {
				throw Error('Matrix addition operands must have identical sizes');
			}
			var rows = [];
			this.forEach(function(val,ndx) {
				rows.push(val.add(rhs[ndx]));
			});
			return Matrix(rows);
		};

		values.sub = function(rhs) {
			if (Object.keys(rhs).indexOf('isMatrix') < 0) {
				rhs = Matrix(rhs);
			}
			if (!this.shape().isEqual(rhs.shape())) {
				throw Error('Matrix subtraction operands must have identical sizes');
			}
			var rows = [];
			this.forEach(function(val,ndx) {
				rows.push(val.sub(rhs[ndx]));
			});
			return Matrix(rows);
		};
		
		values.copy = function() {
			// Returns a deep copy of the current matrix values
			var sh = this.shape();
			var rows = [];
			for (var i = 0; i < sh[0]; i++) {
				var row = [];
				for (var j = 0; j < sh[1]; j++) {
					row.push(this[i][j]);
				}
				rows.push(row);
			}
			return Matrix(rows);
		}
		
		values._multScalar = function(rhs) {
			if (typeof(rhs) != 'number') {
				throw Error('Scalar multiplication method requires a scalar operand');
			}
			var M = this.copy();
			var sh = M.shape();
			for (var i = 0; i < sh[0]; i++) {
				for (var j = 0; j < sh[1]; j++) {
					M[i][j] = rhs * M[i][j];
				}
			}
			return M;
		};
		
		values._multVector = function(rhs) {
			if (!isVector(rhs)) {
				throw Error('Vector multiplication method requires a vector operand');
			}
			var sh = this.shape();
			if (sh[1] != rhs.length) {
				throw Error('Length of vector operand must match width of matrix');
			}
			var values = [];
			for (var i = 0; i < sh[0]; i++) {
				values.push(this.row(i).dot(rhs));
			}
			return Vector(values);
		}
		
		values._multMatrix = function(rhs) {
			if (!isMatrix(rhs)) {
				throw Error('Matrix multiplication method requires a matrix operator');
			}
			if (Object.keys(rhs).indexOf('isMatrix') < 0) {
				rhs = Matrix(rhs);
			}
			if (this.shape()[1] != rhs.shape()[0]) {
				throw Error('Matrix multiplication operands must have identical inner dimensions');
			}
			var rows = [];
			for (var i = 0; i < this.shape()[0]; i++) {
				var row = [];
				for (var j = 0; j < rhs.shape()[1]; j++) {
					row.push(this.row(i).dot(rhs.col(j)));
				}
				rows.push(row);
			}
			return Matrix(rows);
		}
		
		values.mult = function(rhs) {
			if (typeof(rhs) == 'number') {
				return this._multScalar(rhs);
			} else if (isVector(rhs)) {
				return this._multVector(rhs);
			} else if (isMatrix(rhs)) {
				return this._multMatrix(rhs);
			}
			throw Error('Invalid operand for matrix multplication');
		};
		
		values.transpose = function() {
			var s = this.shape();
			var result = Matrix.zeros(s[1], s[0]);
			for (var i = 0; i < s[0]; i++) {
				for (var j = 0; j < s[1]; j++) {
					result[j][i] = this[i][j];
				}
			}
			return result;
		};
		
		values.slice = function(I0,If,J0,Jf) {
			var sh = [If-I0+1, Jf-J0+1];
			var M = Matrix.zeros(sh[0], sh[1]);
			for (var i = I0; i <= If; i++) {
				for (var j = J0; j <= Jf; j++) {
					M[i-I0][j-J0] = this[i][j];
				}
			}
			return M;
		};
		
		values.inverse = function() {
			// [[0,1], [1,1.5]] => [[-1.5,1], [1,0]]
			// [[1,0,2], [3,-3,4], [0,3,1]] => [[-5,2,2], [-1,1/3,2/3], [3,-1,-1]]
			// [[1,0,0,1], [0,2,1,2], [2,1,0,1], [2,0,1,4]] => [[-2,-0.5,1,0.5], [1,0.5,0,-0.5], [-8,-1,2,2], [3,0.5,-1,-0.5]]
			var sh = this.shape();
			if (sh[0] != sh[1]) {
				throw Error('Matrix inversion can only take place for square matrices');
			}
			
			// Initialize adjoint matrix
			var AB = Matrix.zeros(sh[0],2*sh[1]);
			for (var i = 0; i < sh[0]; i++) {
				for (var j = 0; j < sh[1]; j++) {
					AB[i][j] = this[i][j];
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
					var row = AB.row(i);
					AB.setRow(i, AB.row(ndx));
					AB.setRow(ndx, row);
				}
			}
			
			// Triangular reduction
			for (var i = 0; i < sh[0]; i++) {
				for (var ii = i+1; ii < sh[0]; ii++) {
					var ratio = AB[ii][i] / AB[i][i];
					if (ratio != 0) {
						var row = AB.row(ii).mult(1/ratio);
						AB.setRow(ii, AB.row(i).sub(row));
					}
				}
			}
			
			// Normalize triangular edges
			for (var i = 0; i < sh[0]; i++) {
				if (AB[i][i] != 1) {
					var row = AB.row(i);
					row = row.div(row[i]);
					AB.setRow(i, row);
				}
			}
			
			// Upper triangular elimination
			for (var i = sh[0]-1; i >= 0; i--) {
				for (var ii = i-1; ii >= 0; ii--) {
					if (AB[ii][i] != 0) {
						row = AB.row(i).mult(AB[ii][i]);
						AB.setRow(ii, AB.row(ii).sub(row));
					}
				}
			}
			return AB.slice(0,sh[0]-1,sh[0],2*sh[0]-1);
		};
		
		values.isMatrix = true;

		return values;
	};
	
	Matrix.zeros = function(nRows, nCols) {
		if (typeof(nCols) == 'undefined') { nCols = nRows; }
		var rows = [];
		for (var i = 0; i < nRows; i++) {
			var row = [];
			for (var j = 0; j < nCols; j++) {
				row.push(0);
			}
			rows.push(row);
		}
		return Matrix(rows);
	};
	
	Matrix.ones = function(nRows, nCols) {
		if (typeof(nCols) == 'undefined') { nCols = nRows; }
		var rows = [];
		for (var i = 0; i < nRows; i++) {
			var row = [];
			for (var j = 0; j < nCols; j++) {
				row.push(1);
			}
			rows.push(row);
		}
		return Matrix(rows);
	};
	
	Matrix.eyes = function(n) {
		var rows = [];
		for (var i = 0; i < n; i++) {
			var row = [];
			for (var j = 0; j < n; j++) {
				row.push((i == j) + 0);
			}
			rows.push(row);
		}
		return Matrix(rows);
	};

	return {
		isVector: isVector,
		isMatrix: isMatrix,
		Vector: Vector,
		Matrix: Matrix,
		v: Vector,
		M: Matrix,
	};
})();
if (isExt) {
	linal = module.exports;
}
