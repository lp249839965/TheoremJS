/*
**   © Arthur Guiot 2017
**         TheoremJS
*/

if (!BigNumber) {
	var BigNumber = require('bignumber.js');
}
class TheoremJS {
  constructor(precision=20) {
  	BigNumber.set({ DECIMAL_PLACES: precision })
  	// code
  }
  
  factorial(n) {
      if (new BigNumber(n).eq(0)) {
          return new BigNumber(1);
      }
      return new BigNumber(n).times(this.factorial(new BigNumber(n).minus(1)))
  }
  gamma (z) {
  	const g = 7;
  	const p = [
  	    0.99999999999980993,
  	    676.5203681218851,
  	    -1259.1392167224028,
  	    771.32342877765313,
  	    -176.61502916214059,
  	    12.507343278686905,
  	    -0.13857109526572012,
  	    9.9843695780195716e-6,
  	    1.5056327351493116e-7
  	];
      if (z < 0.5) {
          return new BigNumber(Number(Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z).toNumber())).toFixed(10));
      }
      else if(z > 100) return Math.exp(this.lngamma(z));
      else {
          z -= 1;
          let x = p[0];
          for (var i = 1; i < g + 2; i++) {
              x += p[i] / (z + i);
          }
          const t = z + g + 0.5;
  
          return new BigNumber(Number(Math.sqrt(2 * Math.PI)
              * Math.pow(t, z + 0.5)
              * Math.exp(-t)
              * x
          ).toFixed(10))
      }
  }
  ln(x, n = 15) {
      let buffer = new BigNumber(0);
      for (let i = 0; i < Math.ceil(n + (3 / 2 * x)); i++) {
  		const n = new BigNumber(1)
  					.div(new BigNumber(i).times(2).plus(1))
  					.times(
  						new BigNumber(x).minus(1)
  						.div(new BigNumber(x).plus(1))
  						.pow(new BigNumber(i).times(2).plus(1))
  					)
          buffer = buffer.plus(n)
      }
      return new BigNumber(buffer.times(2).toFixed(n - 1))
  }
  lngamma(z) {
  	const g_ln = 607/128;
  	const p_ln = [
  	    0.99999999999999709182,
  	    57.156235665862923517,
  	    -59.597960355475491248,
  	    14.136097974741747174,
  	    -0.49191381609762019978,
  	    0.33994649984811888699e-4,
  	    0.46523628927048575665e-4,
  	    -0.98374475304879564677e-4,
  	    0.15808870322491248884e-3,
  	    -0.21026444172410488319e-3,
  	    0.21743961811521264320e-3,
  	    -0.16431810653676389022e-3,
  	    0.84418223983852743293e-4,
  	    -0.26190838401581408670e-4,
  	    0.36899182659531622704e-5
  	];
      if(z < 0) return Number('0/0');
      let x = p_ln[0];
      for(var i = p_ln.length - 1; i > 0; --i) x += p_ln[i] / (z + i);
      const t = z + g_ln + 0.5;
      return new BigNumber(Number(.5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x)-Math.log(z)).toFixed(10));
  }
  log(x, base, n = 15) {
  	return new BigNumber(this.ln(x, n).div(this.ln(base, n)).toFixed(n - 1))
  }
  pow(n, base) {
      if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
          n = [n]
      }
      let result = []
      for (var i = 0; i < n.length; i++) {
          result.push(new BigNumber(Math.pow(new BigNumber(n[i]).toNumber(), new BigNumber(base).toNumber()).toFixed(10)))
      }
      return result.length == 1 ? result[0] : new BigNumber(result)
  }
  root(n, base) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(new BigNumber(Math.pow(new BigNumber(n[i]).toNumber(), new BigNumber(1).div(base).toNumber()).toFixed(15)))
      }
  	return result.length == 1 ? result[0] : result
  }
  sigmoid(x, n = 15) {
  	return new BigNumber(new BigNumber(1).div(this.pow(this.c("e", n), x).plus(1)).toFixed(n))
  }
  sqrt(n) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(new BigNumber(new BigNumber(n[i]).sqrt()))
      }
  	return result.length == 1 ? result[0] : result
  }
  apply(n, f) {
      if (typeof n != 'object') {
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(f(n[i]))
      }
  	return result.length == 1 ? result[0] : result
  }
  max() {
  	const sorted = this.sort(...arguments);
  	return sorted[sorted.length - 1]
  }
  min() {
  	const sorted = this.sort(...arguments);
  	return sorted[0]
  }
  product() {
  	return [...arguments].reduce((a, b) => new BigNumber(a).times(b))
  }
  sort() {
  	// https://gist.github.com/jasondscott/7073857
  	const t = this;
      Array.prototype.quickSort = function() {
  
          var r = this;
          if (this.length <= 1) {
              return this;
          }
          var less = [],
              greater = [];
  
          var pivot = r.splice(t.floor(new BigNumber(r.length).div(2)), 1);
  
          for (var i = r.length - 1; i >= 0; i--) {
              if (new BigNumber(r[i]).lte(new BigNumber(pivot))) {
                  less.push(r[i]);
              } else {
                  greater.push(r[i]);
              }
          }
  
          var c = [];
  
          return c.concat(less.quickSort(), pivot, greater.quickSort());
      };
  
  	return [...arguments].quickSort()
  }
  sum() {
  	return [...arguments].reduce((a, b) => new BigNumber(a).plus(b))
  }
  average() {
  	const summed = this.sum(...arguments);
  	const average = new BigNumber(summed).div(arguments.length);
  	return average
  }
  correlation(array1, array2) {
      if (array1.length != array2.length) {
          throw "[TheoremJS]: Correlation error, arrays are not the same size"
      }
      const average1 = this.average(...array1).toNumber()
      const average2 = this.average(...array2).toNumber()
      let up = 0;
  	let down1 = 0;
  	let down2 = 0;
      for (var i = 0; i < array1.length; i++) {
          up += (array1[i] - average1)*(array2[i] - average2)
  		down1 += Math.pow(array1[i] - average1, 2)
  		down2 += Math.pow(array2[i] - average2, 2)
      }
  	const result = up / Math.sqrt(down1 * down2)
  	return new BigNumber(Math.round(result * 10 ** 10) / 10 ** 10)
  }
  median() {
  	let array = [...arguments]
  	if (typeof array[0] == 'object') {
  		array = array[0]
  	}
  	array.sort( (a, b) => new BigNumber(a).minus(b).toNumber());
  	if (array.length == 0) return 0
  
  	const half = Math.floor(array.length / 2)
  
  	if (array.length % 2) {
  		return new BigNumber(array[half])
  	} else {
  		return new BigNumber((array[half - 1] + array[half]) / 2)
  	}
  }
  quantile() {
  	let array = [...arguments]
  	let n = array[0]
  	array.shift()
  	if (typeof array[0] == 'object') {
  		array = array[0]
  	}
  	if (n > 1 || n < 0) {
  		throw "[TheoremJS] n should be a Float between 0 and 1"
  	}
  
  	array.sort( (a, b) => a - b);
  	if (array.length == 0) return 0
  
  	const index = (array.length - 1) * n
  	const floor = Math.floor(index)
  	const diff = index - floor;
  	if (array[index + 1] !== undefined) {
  		const out = array[floor] + diff * (array[floor + 1] - array[floor])
  		return new BigNumber(out)
  	} else {
  		return array[floor]
  	}
  }
  regression(data, deg) {
      if (deg == 1) {
          return this.linreg(data)
      } else {
          return this.polyreg(data, deg)
      }
  }
  linreg(array) {
      const x = Object.keys(array)
      const y = Object.values(array)
      const n = y.length;
      let sum_x = 0;
      let sum_y = 0;
      let sum_xy = 0;
      let sum_xx = 0;
      let sum_yy = 0;
  
      for (let i = 0; i < y.length; i++) {
          sum_x += parseFloat(x[i]);
          sum_y += parseFloat(y[i]);
          sum_xy += parseFloat(x[i] * y[i]);
          sum_xx += parseFloat(x[i] * x[i]);
          sum_yy += parseFloat(y[i] * y[i]);
      }
  
      const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
      const intercept = (sum_y - slope * sum_x) / n;
      return this.polynomial(slope, intercept)
  }
  polyreg(data, deg) {
      const x = Object.keys(data)
      for (let i in x) {
          x[i] = parseFloat(x[i])
      }
      const y = Object.values(data)
      for (let i in y) {
          y[i] = parseFloat(y[i])
      }
      const lhs = [];
      const rhs = [];
      let a = 0;
      let b = 0;
      let c;
      let k;
  
      var i;
      let j;
      let l;
      const len = x.length;
  
      let results;
      let equation;
      let string;
  
      if (typeof deg === 'undefined') {
          k = 3;
      } else {
          k = deg + 1;
      }
  
      for (i = 0; i < k; i++) {
          for (l = 0; l < len; l++) {
              if (y[l] !== null) {
                  a += x[l] ** i * y[l];
              }
          }
  
          lhs.push(a);
          a = 0;
  
          c = [];
          for (j = 0; j < k; j++) {
              for (l = 0; l < len; l++) {
                  if (y[l] !== null) {
                      b += x[l] ** (i + j);
                  }
              }
              c.push(b);
              b = 0;
          }
          rhs.push(c);
      }
      rhs.push(lhs);
      equation = this.gaussElimination(rhs, k);
  
      return this.polynomial(...equation.reverse())
  }
  acos(n) {
      if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.acos(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  acosh(n) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.acosh(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  angle2Vec(rad) {
  	return [this.cos(rad), this.sin(rad)];
  }
  asin(n) {
      if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.asin(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  asinh(n) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.asinh(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  atan(n) {
      if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.atan(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  atan2(x, y) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		x = x.isBigNumber == true ? x.toNumber() : x
          x = [x]
  		y = y.isBigNumber == true ? y.toNumber() : y
          y = [y]
      }
  	let result = []
      for (var i = 0; i < x.length; i++) {
      	result.push(Math.atan2(x[i], y[i]))
      }
  	return result.length == 1 ? result[0] : result
  }
  atanh(n) {
  	if (typeof n != 'object') {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.atanh(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  cos(n) {
      if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.cos(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  cosh(n) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.cosh(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  deg2rad(x) {
      return new BigNumber(x).times(this.pi()).div(180)
  }
  drawCircularPoints(n, r=1, start=[-r, 0]) {
  	const angle = this.pi().times(2).div(n)
  	let buffer = {}
  	buffer[start[0]] = start[1]
  	let angleState = this.atan2(...start.reverse()) + angle.toNumber()
  	for (var i = 0; i < n - 1; i++) {
  		const x = new BigNumber(r).times(this.cos(angleState)).toString()
  		const y = new BigNumber(r).times(this.sin(angleState)).toNumber()
  		buffer[x] = y
  		angleState += angle.toNumber()
  	}
  	return buffer
  }
  rad2deg(x) {
  	return new BigNumber(x).times(180).div(this.pi())
  }
  sin(n) {
      if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
          n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
      let result = []
      for (var i = 0; i < n.length; i++) {
          result.push(Math.sin(n[i]).toFixed(15))
      }
      return result.length == 1 ? result[0] : result
  }
  sinh(n) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.sinh(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  tan(n) {
      if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.tan(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  tanh(n) {
  	if (typeof n != 'object' || BigNumber.isBigNumber(n)) {
  		n = BigNumber.isBigNumber(n) == true ? n.toNumber() : n
          n = [n]
      }
  	let result = []
      for (var i = 0; i < n.length; i++) {
      	result.push(Math.tanh(n[i]).toFixed(15))
      }
  	return result.length == 1 ? result[0] : result
  }
  derivate(poly) {
  	if (poly.type != 'polynomial') {
  		throw "TheoremJS: Derivative: Not a polynomial"
  		return 0;
  	}
  	let values = []
  	const arr = poly.values.reverse()
  	for (let i = 0; i < arr.length; i++) {
  		values.push(i * arr[i])
  	}
  	values.reverse()
  	values.pop()
  	const out = values.filter(a => !isNaN(a))
  
  	return this.polynomial(...out)
  }
  f(v, func) {
  	if (typeof v == 'function') {
  		return {
  			type: "function",
  			core: v
  		}
  	}
  	return {
  		type: "function",
  		v: v,
  		f: func,
  		core: x => {
  			let regex = new RegExp(v)
  			let newStr = func.replace(regex, `(${x})`)
  			return eval(newStr).toFixed(14)
  		}
  	}
  }
  findRoots(f) {
      let exp = [];
      if (f.type == "polynomial") {
          switch (f.values.length - 1) {
              case 1:
                  exp.push(`${new BigNumber(f.values[1]).isNegative() ? '' : '-'}${f.values[1]} / ${f.values[0]}`)
                  break;
              case 2:
  				const delta = new BigNumber(f.values[1]).pow(2).minus(new BigNumber(4).times(f.values[0]).times(f.values[2])).toNumber()
  				if (delta > 0) {
  					exp.push(`(${new BigNumber(f.values[1]).isNegative() ? '' : '-'}${new BigNumber(f.values[1]).abs()} + Math.sqrt(${delta})) / ${new BigNumber(f.values[0]).times(2)}`)
  	                exp.push(`(${new BigNumber(f.values[1]).isNegative() ? '' : '-'}${new BigNumber(f.values[1]).abs()} - Math.sqrt(${delta})) / ${new BigNumber(f.values[0]).times(2)}`)
  				}
                  break;
              case 3:
                  let a = new BigNumber(f.values[0]).toNumber()
                  let b = new BigNumber(f.values[1]).toNumber()
                  let c = new BigNumber(f.values[2]).toNumber()
                  let d = new BigNumber(f.values[3]).toNumber()
  
                  // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
                  var p = (3 * a * c - b * b) / (3 * a * a);
                  var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
                  var roots;
  
                  if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
                      roots = [Math.cbrt(-q)];
                  } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
                      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
                  } else {
                      var D = q * q / 4 + p * p * p / 27;
                      if (Math.abs(D) < 1e-8) { // D = 0 -> two roots
                          roots = [-1.5 * q / p, 3 * q / p];
                      } else if (D > 0) { // Only one real root
                          var u = Math.cbrt(-q / 2 - Math.sqrt(D));
                          roots = [u - p / (3 * u)];
                      } else { // D < 0, three roots, but needs to use complex numbers/trigonometric solution
                          var u = 2 * Math.sqrt(-p / 3);
                          var t = Math.acos(3 * q / p / u) / 3; // D < 0 implies p < 0 and acos argument in [-1..1]
                          var k = 2 * Math.PI / 3;
                          roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
                      }
                  }
  
                  // Convert back from depressed cubic
                  for (var i = 0; i < roots.length; i++)
                      roots[i] -= b / (3 * a);
                  exp = roots;
                  break;
              default:
                  exp = [numeralSolve(f, 0)[0]]
          }
      } else {
          exp = [numeralSolve(f, 0)[0]]
      }
      return exp
  }
  gaussElimination(input, order) {
      const matrix = input;
      const n = input.length - 1;
      const coefficients = [order];
  
      for (let i = 0; i < n; i++) {
          let maxrow = i;
          for (let j = i + 1; j < n; j++) {
              if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
                  maxrow = j;
              }
          }
  
          for (let k = i; k < n + 1; k++) {
              const tmp = matrix[k][i];
              matrix[k][i] = matrix[k][maxrow];
              matrix[k][maxrow] = tmp;
          }
  
          for (let j = i + 1; j < n; j++) {
              for (let k = n; k >= i; k--) {
                  matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i];
              }
          }
      }
  
      for (let j = n - 1; j >= 0; j--) {
          let total = 0;
          for (let k = j + 1; k < n; k++) {
              total += matrix[k][j] * coefficients[k];
          }
  
          coefficients[j] = (matrix[n][j] - total) / matrix[j][j];
      }
  
      return coefficients;
  }
  gradient(p1, p2) {
  	const x1 = Number(Object.keys(p1)[0])
  	const y1 = Number(Object.values(p1)[0])
  	const x2 = Number(Object.keys(p2)[0])
  	const y2 = Number(Object.values(p2)[0])
  
  	const slope = (y2 - y1) / (x2 - x1)
  	
  	return slope
  }
  graph(f, from=-100, to=100, step=0.1) {
  	let array = {}
  	for (var i = new BigNumber(from); i.lessThanOrEqualTo(new BigNumber(to)); i = i.plus(new BigNumber(step))) {
  		array[i.toString()] = f.core(i).toFixed(15)
  	}
  	return array
  }
  integrate(poly) {
  	if (poly.type != 'polynomial') {
  		throw "TheoremJS: Integrate: Not a polynomial"
  		return 0;
  	}
  	let values = []
  	for (let i in poly.values.reverse()) {
  		values.push(poly.values[i] / (parseInt(i)+1))
  	}
  	values.reverse()
  	values.push(0)
  	const out = values.filter(a => !isNaN(a))
  
  	return this.polynomial(...out)
  }
  numeralSolve(f, end, from = -100, to = 100, step = 0.1) {
  	let buffer = []
  	let index = []
  	for (let i = new BigNumber(from); i.lt(to); i = i.plus(step)) {
  		buffer.push(this.run(f, i.toNumber()))
  		index.push(i.toNumber())
  	}
  	function closest(num, arr) {
  		let curr = arr[0];
  		let diff = Math.abs(num - curr);
  		for (let val = 0; val < arr.length; val++) {
  			const newdiff = Math.abs(num - arr[val]);
  			if (newdiff < diff) {
  				diff = newdiff;
  				curr = arr[val];
  			}
  		}
  		return curr;
  	}
  	const close = closest(end, buffer.filter(x => !isNaN(x)))
  	return index[buffer.indexOf(close)]
  }
  polynomial() {
  	const args = [...arguments].reverse()
  	let buffer = "";
  	for (let i = 0; i < args.length; i++) {
  		buffer += `${args[i]} * x**${i} ${i == args.length -1 ? '': '+ '}`
  	}
  	return {
  		type: "polynomial",
  		v: "x",
  		f: buffer,
  		values: [...arguments],
  		core: x => {
  			let regex = new RegExp("x")
  			let newStr = buffer.replace(regex, `(${x})`)
  			return eval(newStr).toFixed(14)
  		}
  	}
  }
  run(f, x) {
  	x = new BigNumber(x).toNumber()
  	let out = 0
  	try {
  		out = f.core(x)
  	} catch(e) {
  		console.log(`[TheoremJS]: ${e}`)
  	}
  	return out
  }
  slope(f, x=0, i=1E-10) {
  	const f1 = f.core(x)
  	const x1 = x
  	const f2 = f.core(x + i)
  	const x2 = x + i
  	return new BigNumber(f2).minus(f1).div(new BigNumber(x2).minus(x1))
  }
  y_intercept(f) {
  	return f.core(0)
  }
  toDec() {
  	const args = [...arguments]
  	if (args.length != 2) {
  		throw "Require 2 numbers"
  	}
  	return new BigNumber(args[0]).div(args[1])
  }
  toFraction(x, p=15) {
  	const BN = BigNumber.clone({ DECIMAL_PLACES: 20 })
  	return new BN(x.toFixed(15)).toFraction(p)
  }
  * collatz(n) {
  	while (n != 1) {
  		if(n % 2 == 0) {
  			n = n / 2
  		} else {
  			n = 3 * n + 1
  		}
  		yield n;
  	}
  }
  * fibonacci() {
      let fn1 = 0;
      let fn2 = 1;
      while (true) {
          const current = fn1;
          fn1 = fn2;
          fn2 = fn1 + current;
          const reset = yield current;
          if (reset) {
              fn1 = 0;
              fn2 = 1;
          }
      }
  }
  * sieve() {
      let n = 2;
  
      while (true) {
          if (this.isPrime(n)) yield n;
          n++;
      }
  }
  abs(n) {
  	return new BigNumber(n).abs()
  }
  c(name, n = 15) {
      const numbers = {
          "alphaParticleMass": "6.64465675e-27",
          "atomicMass": "1.660538921e-27",
          "Avogadro": "6.02214129e23",
          "Boltzmann": "1.3806488e-23",
          "conductanceQuantum": "7.7480917346e-5",
          "e": "2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427427466391932003059921817413596629043572900334295260595630738132328627943490763233829880753195251019011573834187930702154089149934884167509244761460668",
          "earth-moon": "384401",
          "earth-sun": "1.496e8",
          "earthMass": "5.974e+24",
          "earthRadius": "6378",
          "electric": "8.854187e-12",
          "electronMass": "9.10938291e-31",
          "elementaryCharge": "1.602176565e-19",
          "EulerGamma": "0.5772156649015328606065120900824024310421593359399235988057672348848677267776646709369470632917467495146314472498070824809605040144865428362241739976449235362535003337429373377376739427925952582470949160087352039481656708532331517766115286211995015080",
          "Faraday": "96485.3365",
          "fineStructure": "7.2973525698e-3",
          "goldenRatio": "1.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389086595939582905638322661319928290267880675208766892501711696207032221043216269548626296",
          "gravity": "9.80665",
          "inverseFineStructure": "137.035999074",
          "magnetic": "12.566370614e-7",
          "magneticFluxQuantum": "2.067833758e-15",
          "molarGas": "8.3144621",
          "moonMass": "7.348e22",
          "moonRadius": "1738",
          "neutronMass": "1.674927351e-27",
          "NewtonGravitation": "6.67384e-11",
          "pi": "3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909",
          "Planck": "6.62606957e-34",
          "proton-electronMassRatio": "1836.15267245",
          "proton-neutronMassRatio": "0.99862347826",
          "protonMass": "1.672621777e-27",
          "Rydberg": "10973731.568539",
          "speedOfLight": "299792458",
          "speedOfSound": "340.27",
          "sqrt(2)": "1.414213562373095048801688724209698078569671875376948073176679737990732478462107038850387534327641572735013846230912297024924836055850737212644121497099935831413222665927505592755799950501152782060571470109559971605970274534596862014728517418640889199",
          "Stefan-Boltzmann": "5.670373e-8",
          "sunMass": "1.989e30",
          "sunRadius": "695500",
          "TheRockMass": "124.73790175",
          "ThomsonCrossSection": "0.6652458734e-28",
          "UltimateAnswer": "42",
          "zeroKelvin": "-273.15"
      }
      const BN = BigNumber.clone({
          DECIMAL_PLACES: n
      })
      const num = numbers[name].split("e")
      if (num.length > 1) {
          return new BN(`${num[0].slice(0, n + 2)}e${num[1]}`)
      }
      return new BN(num[0].slice(0, n + 2))
  }
  ceil(n) {
  	return new BigNumber(n).integerValue(BigNumber.ROUND_CEIL)
  }
  e(n = 15) {
  	const BN = BigNumber.clone({ DECIMAL_PLACES: n })
      let zero = new BN(0);
      let one = new BN(1);
      let rval;
  
      for (let i = 0; i <= n * 10; i++) {
          let fval = this.factorial(i);
          let invert = one.div(fval)
          zero = zero.plus(invert)
      }
      return new BN(zero);
  }
  floor(n) {
  	return new BigNumber(n).integerValue(BigNumber.ROUND_FLOOR)
  }
  goldenRatio(n = 15) {
  	const BN = BigNumber.clone({ DECIMAL_PLACES: n + 1 })
  	return new BN(BN(1).plus(this.sqrt(5)).div(2).toFixed(n + 1))
  }
  isPrime(n) {
  	n = new BigNumber(n).abs()
  	const leastFactor = this.leastFactor(n)
  	if (n.eq(leastFactor) && n.gte(2)) {
  		return true
  	}
  	return false
  }
  leastFactor(n) {
  	n = new BigNumber(n).abs().toNumber()
  	if (Number.MAX_SAFE_INTEGER < n) throw `${n} is superior to ${Number.MAX_SAFE_INTEGER}`
  	let out = false
      if (isNaN(n) || !isFinite(n)) out = out !== false ? out : NaN;
      if (n == 0) out = out !== false ? out : 0;
      if (n % 1 || n * n < 2) out = out !== false ? out : 1;
      if (n % 2 == 0) out = out !== false ? out : 2;
      if (n % 3 == 0) out = out !== false ? out : 3;
      if (n % 5 == 0) out = out !== false ? out : 5;
      const m = Math.sqrt(n);
      for (let i = 7; i <= m; i += 30) {
          if (n % i == 0) out = out !== false ? out : i;
          if (n % (i + 4) == 0) out = out !== false ? out : i + 4;
          if (n % (i + 6) == 0) out = out !== false ? out : i + 6;
          if (n % (i + 10) == 0) out = out !== false ? out : i + 10;
          if (n % (i + 12) == 0) out = out !== false ? out : i + 12;
          if (n % (i + 16) == 0) out = out !== false ? out : i + 16;
          if (n % (i + 22) == 0) out = out !== false ? out : i + 22;
          if (n % (i + 24) == 0) out = out !== false ? out : i + 24;
      }
      out = out !== false ? out : n
  
  	return new BigNumber(out)
  }
  n(n, base=10) {
  	return new BigNumber(n, base)
  }
  nPrime(n) {
  	n = new BigNumber(n).toNumber()
  	if (n < 1) {
  		throw "[TheoremJS]: n is less than 1"
  	}
  	if (n > Number.MAX_SAFE_INTEGER) {
  		throw `[TheoremJS] Input was larger than ${Number.MAX_SAFE_INTEGER}`
  	}
  	const gen = this.sieve()
  	let out = 0
  	for (var i = 0; i < n; i++) {
  		out = gen.next().value
  	}
  	return new BigNumber(out)
  }
  pi(digits = 15) {
  	const Decimal = BigNumber.clone({ DECIMAL_PLACES: digits })
      function arctan(x) {
          var y = x;
          var yPrev = NaN;
          var x2 = x.times(x);
          var num = x;
          var sign = -1;
  
          for (var k = 3; !y.eq(yPrev); k += 2) {
              num = num.times(x2);
  
              yPrev = y;
              y = (sign > 0) ? y.plus(num.div(k)) : y.minus(num.div(k));
              sign = -sign;
          }
  
          return y;
      }
  
      // Machin: Pi / 4 = 4 * arctan(1 / 5) - arctan(1 / 239)
      // http://milan.milanovic.org/math/english/pi/machin.html
  
      // we calculate pi with a few decimal places extra to prevent round off issues
      var DecimalPlus = BigNumber.clone({ DECIMAL_PLACES: digits + 4 })
      var pi4th = new DecimalPlus(4).times(arctan(new DecimalPlus(1).div(5)))
          .minus(arctan(new DecimalPlus(1).div(239)));
  
      // the final pi has the requested number of decimals
      return new Decimal(4).times(new Decimal(pi4th))
  }
  primeFactors(n) {
  	n = new BigNumber(n).toNumber()
  	if (n < 2) {
  		throw "[TheoremJS] Number should be greater or equal to 2"
  	}
  	if (n > Number.MAX_SAFE_INTEGER) {
  		throw `[TheoremJS] Input was larger than ${Number.MAX_SAFE_INTEGER}`
  	}
  	let list = []
  	for (var i = 2; i <= n; i++) {
  		if (n % i == 0) {
  			if (this.isPrime(i)) {
  				n /= i
  				list.push(new BigNumber(i))
  				i = i - 1 // check for number twice (example 100 = 2*2*5*5)
  			}
  		}
  	}
  	return list
  }
  primePi(n) {
  	n = new BigNumber(n).toNumber()
  	if (n < 2) {
  		throw "[TheoremJS] Number should be greater or equal to 2"
  	}
  	if (n > Number.MAX_SAFE_INTEGER) {
  		throw `[TheoremJS] Input was larger than ${Number.MAX_SAFE_INTEGER}`
  	}
  	const gen = this.sieve()
  	let out = 0
  	for (var i = 0; i < n; i = gen.next().value) {
  		out += 1
  	}
  	return new BigNumber(out - 1)
  }
  round(n, precision = 0) {
  	const tenPow = this.pow(10, precision)
  	return new BigNumber(n).times(tenPow).integerValue(BigNumber.ROUND_HALF_CEIL).div(tenPow)
  }
  rand(n = 1, crypto = false) {
  	const BN = BigNumber.clone({ CRYPTO: crypto })
  	let out = []
  	for (var i = 0; i < n; i++) {
  		out.push(BN.random())
  	}
  	return out.length == 1 ? out[0] : out
  }
  config(obj) {
  	BigNumber.set(obj)
  }
  convertToBase(x, n) {
  	const BN = BigNumber.clone({ ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/" })
  	return new BN(x).toString(n)
  }
  toBase10(n, base) {
  	return new BigNumber(n, base);
  }
  flatten(array) {
  	return array.reduce((a, b) => a.concat(b), []);
  }
  linspace(start, end, n) {
  	const diff = end - start;
  	const step = diff / n;
  	return this.arange(start, end, step);
  }
  arange(start, end, step, offset) {
  	const len = (Math.abs(end - start) + ((offset || 0) * 2)) / (step || 1) + 1;
  	const direction = start < end ? 1 : -1;
  	const startingPoint = start - (direction * (offset || 0));
  	const stepSize = direction * (step || 1);
  
  	return Array(len).fill(0).map((_, index) => startingPoint + (stepSize * index));
  }
  range(n) {
  	return this.arange(0, n, 1);
  }
  reshape(array, part) {
  	const tmp = [];
  	for (let i = 0; i < array.length; i += part) {
  		tmp.push(array.slice(i, i + part));
  	}
  	return tmp;
  }
  bin2str(txt) {
  	return txt.replace(/\s*[01]{8}\s*/g, function(bin) {
          return String.fromCharCode(parseInt(bin, 2))
      })
  }
  md5(s) {
  	if (BigNumber.isBigNumber(s) || (!isNaN(parseFloat(s)) && isFinite(s))) {
  		s = s.toString()
  	}
  	let string = s;
  
  	function RotateLeft(lValue, iShiftBits) {
  		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  	}
  
  	function AddUnsigned(lX, lY) {
  		let lX4;
  		let lY4;
  		let lX8;
  		let lY8;
  		let lResult;
  		lX8 = (lX & 0x80000000);
  		lY8 = (lY & 0x80000000);
  		lX4 = (lX & 0x40000000);
  		lY4 = (lY & 0x40000000);
  		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
  		if (lX4 & lY4) {
  			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
  		}
  		if (lX4 | lY4) {
  			if (lResult & 0x40000000) {
  				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
  			} else {
  				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
  			}
  		} else {
  			return (lResult ^ lX8 ^ lY8);
  		}
  	}
  
  	function F(x, y, z) {
  		return (x & y) | ((~x) & z);
  	}
  
  	function G(x, y, z) {
  		return (x & z) | (y & (~z));
  	}
  
  	function H(x, y, z) {
  		return (x ^ y ^ z);
  	}
  
  	function I(x, y, z) {
  		return (y ^ (x | (~z)));
  	}
  
  	function FF(a, b, c, d, x, s, ac) {
  		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
  		return AddUnsigned(RotateLeft(a, s), b);
  	}
  
  	function GG(a, b, c, d, x, s, ac) {
  		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
  		return AddUnsigned(RotateLeft(a, s), b);
  	}
  
  	function HH(a, b, c, d, x, s, ac) {
  		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
  		return AddUnsigned(RotateLeft(a, s), b);
  	}
  
  	function II(a, b, c, d, x, s, ac) {
  		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
  		return AddUnsigned(RotateLeft(a, s), b);
  	}
  
  	function ConvertToWordArray(string) {
  		let lWordCount;
  		const lMessageLength = string.length;
  		const lNumberOfWords_temp1 = lMessageLength + 8;
  		const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
  		const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
  		const lWordArray = Array(lNumberOfWords - 1);
  		let lBytePosition = 0;
  		let lByteCount = 0;
  		while (lByteCount < lMessageLength) {
  			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
  			lBytePosition = (lByteCount % 4) * 8;
  			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
  			lByteCount++;
  		}
  		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
  		lBytePosition = (lByteCount % 4) * 8;
  		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
  		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
  		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
  		return lWordArray;
  	}
  
  	function WordToHex(lValue) {
  		let WordToHexValue = "";
  		let WordToHexValue_temp = "";
  		let lByte;
  		let lCount;
  		for (lCount = 0; lCount <= 3; lCount++) {
  			lByte = (lValue >>> (lCount * 8)) & 255;
  			WordToHexValue_temp = `0${lByte.toString(16)}`;
  			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
  		}
  		return WordToHexValue;
  	}
  
  	function Utf8Encode(string) {
  		string = string.replace(/\r\n/g, "\n");
  		let utftext = "";
  
  		for (let n = 0; n < string.length; n++) {
  
  			const c = string.charCodeAt(n);
  
  			if (c < 128) {
  				utftext += String.fromCharCode(c);
  			} else if ((c > 127) && (c < 2048)) {
  				utftext += String.fromCharCode((c >> 6) | 192);
  				utftext += String.fromCharCode((c & 63) | 128);
  			} else {
  				utftext += String.fromCharCode((c >> 12) | 224);
  				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
  				utftext += String.fromCharCode((c & 63) | 128);
  			}
  
  		}
  
  		return utftext;
  	}
  
  	let x = Array();
  	let k;
  	let AA;
  	let BB;
  	let CC;
  	let DD;
  	let a;
  	let b;
  	let c;
  	let d;
  	const S11 = 7;
  	const S12 = 12;
  	const S13 = 17;
  	const S14 = 22;
  	const S21 = 5;
  	const S22 = 9;
  	const S23 = 14;
  	const S24 = 20;
  	const S31 = 4;
  	const S32 = 11;
  	const S33 = 16;
  	const S34 = 23;
  	const S41 = 6;
  	const S42 = 10;
  	const S43 = 15;
  	const S44 = 21;
  
  	string = Utf8Encode(string);
  
  	x = ConvertToWordArray(string);
  
  	a = 0x67452301;
  	b = 0xEFCDAB89;
  	c = 0x98BADCFE;
  	d = 0x10325476;
  
  	for (k = 0; k < x.length; k += 16) {
  		AA = a;
  		BB = b;
  		CC = c;
  		DD = d;
  		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
  		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
  		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
  		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
  		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
  		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
  		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
  		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
  		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
  		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
  		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
  		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
  		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
  		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
  		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
  		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
  		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
  		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
  		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
  		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
  		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
  		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
  		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
  		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
  		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
  		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
  		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
  		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
  		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
  		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
  		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
  		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
  		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
  		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
  		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
  		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
  		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
  		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
  		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
  		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
  		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
  		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
  		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
  		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
  		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
  		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
  		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
  		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
  		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
  		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
  		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
  		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
  		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
  		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
  		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
  		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
  		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
  		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
  		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
  		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
  		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
  		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
  		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
  		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
  		a = AddUnsigned(a, AA);
  		b = AddUnsigned(b, BB);
  		c = AddUnsigned(c, CC);
  		d = AddUnsigned(d, DD);
  	}
  
  	const temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  
  	return temp.toLowerCase();
  }
  sha256(input) {
  	let s = input;
  
  	const chrsz = 8;
  	const hexcase = 0;
  
  	function safe_add(x, y) {
  		const lsw = (x & 0xFFFF) + (y & 0xFFFF);
  		const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  		return (msw << 16) | (lsw & 0xFFFF);
  	}
  
  	function S(X, n) {
  		return (X >>> n) | (X << (32 - n));
  	}
  
  	function R(X, n) {
  		return (X >>> n);
  	}
  
  	function Ch(x, y, z) {
  		return ((x & y) ^ ((~x) & z));
  	}
  
  	function Maj(x, y, z) {
  		return ((x & y) ^ (x & z) ^ (y & z));
  	}
  
  	function Sigma0256(x) {
  		return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
  	}
  
  	function Sigma1256(x) {
  		return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
  	}
  
  	function Gamma0256(x) {
  		return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
  	}
  
  	function Gamma1256(x) {
  		return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
  	}
  
  	function core_sha256(m, l) {
  		const K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
  		const HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
  		const W = new Array(64);
  		let a;
  		let b;
  		let c;
  		let d;
  		let e;
  		let f;
  		let g;
  		let h;
  		var i;
  		var j;
  		let T1;
  		let T2;
  		m[l >> 5] |= 0x80 << (24 - l % 32);
  		m[((l + 64 >> 9) << 4) + 15] = l;
  		for (var i = 0; i < m.length; i += 16) {
  			a = HASH[0];
  
  			b = HASH[1];
  
  			c = HASH[2];
  
  			d = HASH[3];
  
  			e = HASH[4];
  
  			f = HASH[5];
  
  			g = HASH[6];
  
  			h = HASH[7];
  			for (var j = 0; j < 64; j++) {
  				if (j < 16) W[j] = m[j + i];
  				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
  
  				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
  				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
  				h = g;
  				g = f;
  				f = e;
  				e = safe_add(d, T1);
  				d = c;
  				c = b;
  				b = a;
  				a = safe_add(T1, T2);
  			}
  			HASH[0] = safe_add(a, HASH[0]);
  
  			HASH[1] = safe_add(b, HASH[1]);
  
  			HASH[2] = safe_add(c, HASH[2]);
  
  			HASH[3] = safe_add(d, HASH[3]);
  
  			HASH[4] = safe_add(e, HASH[4]);
  
  			HASH[5] = safe_add(f, HASH[5]);
  
  			HASH[6] = safe_add(g, HASH[6]);
  
  			HASH[7] = safe_add(h, HASH[7]);
  
  		}
  		return HASH;
  	}
  
  	function str2binb(str) {
  		const bin = Array();
  
  		const mask = (1 << chrsz) - 1;
  
  		for (let i = 0; i < str.length * chrsz; i += chrsz) {
  
  			bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
  
  		}
  
  		return bin;
  
  	}
  
  
  	function Utf8Encode(string) {
  
  		string = string.replace(/\r\n/g, "\n");
  
  		let utftext = "";
  		for (let n = 0; n < string.length; n++) {
  			const c = string.charCodeAt(n);
  			if (c < 128) {
  
  				utftext += String.fromCharCode(c);
  
  			} else if ((c > 127) && (c < 2048)) {
  
  				utftext += String.fromCharCode((c >> 6) | 192);
  
  				utftext += String.fromCharCode((c & 63) | 128);
  
  			} else {
  
  				utftext += String.fromCharCode((c >> 12) | 224);
  
  				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
  
  				utftext += String.fromCharCode((c & 63) | 128);
  
  			}
  		}
  		return utftext;
  
  	}
  
  	function binb2hex(binarray) {
  
  		const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  
  		let str = "";
  
  		for (let i = 0; i < binarray.length * 4; i++) {
  
  			str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
  
  				hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
  
  		}
  
  		return str;
  
  	}
  	if (BigNumber.isBigNumber(s) || (!isNaN(parseFloat(s)) && isFinite(s))) {
  		s = s.toString()
  	}
  	s = Utf8Encode(s);
  
  	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
  }
  str2bin(txt, spaceSeparatedOctets) {
  	function zeroPad(num) {
  		return "00000000".slice(String(num).length) + num
  	}
  	return txt.replace(/[\s\S]/g, function(str) {
  		str = zeroPad(str.charCodeAt().toString(2));
  		return !1 == spaceSeparatedOctets ? str : str + " "
  	})
  }
}
// Browserify / Node.js
if (typeof define === "function" && define.amd) {
  define(() => new TheoremJS());
  // CommonJS and Node.js module support.
} else if (typeof exports !== "undefined") {
  // Support Node.js specific `module.exports` (which can be a function)
  if (typeof module !== "undefined" && module.exports) {
    exports = module.exports = new TheoremJS();
  }
  // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
  exports.TheoremJS = new TheoremJS();
} else if (typeof global !== "undefined") {
  global.TheoremJS = new TheoremJS();
}