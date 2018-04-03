/* Basic, but very useful, JavaScript unit tester.
*/

define(function(require, exports, module) {
    var Results = ['passed', 'failed', 'aborted'];

    function TestCase(test) {
        this.test = test;
        return this;
    }

    TestCase.prototype.assert = function(actual, expected) {
        return expected == actual;
    };

    TestCase.prototype.assertEach = function(actual, expected) {
        return expected.every(function(val, ndx) {
            return val == actual[ndx];
        });
    };

    TestCase.prototype.assertTolerance = function(actual, expected, tolerance) {
        if (typeof(tolerance) == 'undefined') { tolerance = 1e-8; }
        var error = Math.abs(actual - expected) / expected;
        return error < tolerance;
    };

    TestCase.prototype.assertVector = function(actual, expected, tolerance) {
        /* Relative magnitude of error vector must be within tolerance (defaults to 1e-8).
        */
        if (typeof(tolerance) == 'undefined') { tolerance = 1e-8; }
        var error = actual.map(function(v, i) { return v - expected[i]; });
        var eMag = Math.sqrt(error.reduce(function(acc, val) { return acc + val * val; }, 0));
        var xMag = Math.sqrt(expected.reduce(function(acc, val) { return acc + val * val; }, 0));
        return eMag / xMag < tolerance;
    };

    TestCase.prototype.assertStringI = function(actual, expected) {
        // a == b is sufficient for case-sensitive
        return actual.toLowerCase() == expected.toLowerCase();
    };

    TestCase.prototype.run = function() {
        try {
            if (this.test()) {
                return Results.indexOf('passed');
            } else {
                return Results.indexOf('failed');
            }
        } catch (error) {
            return Results.indexOf('aborted');
        }
    };

    function UnitTester() {
        this.tests = [];
        return this;
    }

    UnitTester.prototype.addTest = function(test) {
        this.tests.push(new TestCase(test));
    };

    UnitTester.prototype.runAll = function() {
        var results = {
            passed: 0,
            failed: 0,
            aborted: 0,
            each: []
        };
        this.tests.forEach(function(test) {
            var result = test.run();
            results.each.push(result);
            if (result == Results.indexOf('passed')) {
                results.passed++;
            } else if (result == Results.indexOf('failed')) {
                results.failed++;
            } else {
                results.aborted++;
            }
        });
        return results;
    };

    UnitTester.prototype.getTestName = function(ndx) {
        var name = "#" + ndx;
        var str = this.tests[ndx].test.toString();
        var match = str.match(/^function (\w+)\(/);
        if (match) {
            name = match[1];
        }
        return name;
    };

    UnitTester.prototype.renderResults = function(document, results) {
        /* Returns an HTML table into which a test results object is rendered
        */
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        var th = document.createElement('th');
            th.textContent = 'Test';
            tr.appendChild(th);
        th = document.createElement('th');
            th.textContent = 'Result';
            tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);
        var tbody = document.createElement('tbody');
        results.each.forEach(function(result, ndx) {
            tr = document.createElement('tr');
            var td = document.createElement('td');
                td.textContent = this.getTestName(ndx);
                tr.appendChild(td);
            td = document.createElement('td');
                td.textContent = Results[result];
                var rgb = ['00', '00', '00'];
                if (result == 0) {
                    rgb[1] = 'ff';
                } else if (result == 1) {
                    rgb[0] = rgb[1] = 'ff';
                } else {
                    rgb[0] = 'ff';
                }
                td.setAttribute('style', 'background-color:#' + rgb.join(''));
                tr.appendChild(td);
            tbody.append(tr);
        }, this);
        tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = '&nbsp;';
            tr.appendChild(td);
            tbody.appendChild(tr);
        tr = document.createElement('tr');
            td = document.createElement('td');
            td.textContent = 'Passed';
            tr.appendChild(td);
            td = document.createElement('td');
            td.textContent = results.passed;
            tr.appendChild(td);
            tbody.append(tr);
        tr = document.createElement('tr');
            td = document.createElement('td');
            td.textContent = 'Failed';
            tr.appendChild(td);
            td = document.createElement('td');
            td.textContent = results.failed;
            tr.appendChild(td);
            tbody.append(tr);
        tr = document.createElement('tr');
            td = document.createElement('td');
            td.textContent = 'Aborted';
            tr.appendChild(td);
            td = document.createElement('td');
            td.textContent = results.aborted;
            tr.appendChild(td);
            tbody.append(tr);
        table.appendChild(tbody);
        return table;
    };

    return UnitTester;
});
