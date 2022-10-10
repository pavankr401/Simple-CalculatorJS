import { render } from '@testing-library/react';
import React from 'react';
import './App.css';


function calculate(loopRuns, sum, operators, nums){

  if(nums.length == 1)
  {
    return nums[0];
  }

  while (loopRuns-- > 0) {
    if (loopRuns === 1) {
      let i = operators.length;
      while (i-- > 0) {
        let op = operators[i]
        if (op.length > 1) {
          if (op[op.length - 1] !== '-') {
            operators[i] = op[op.length - 1];
          }
          else {
            nums[i + 1] = -nums[i + 1];
            operators[i] = op[op.length - 2];
          }
        }
        switch (operators[i]) {
          case '+':
            sum = parseFloat(nums[i].toFixed(12)) + parseFloat(nums[i + 1].toFixed(12));
            nums.splice(i, 2, sum);
            break;
          case '*':
            sum = nums[i] * nums[i + 1];
            nums.splice(i, 2, sum);
            break;
          case '/':
            sum = nums[i] / nums[i + 1];
            nums.splice(i, 2, sum);
            break;

          default:
            break;
        }

      }// end of loop
    }

    if (loopRuns === 0) {
      let j = nums.length - 1;
      while (j-- > 0) {
        let diff = nums[j] + nums[j + 1];
        nums.splice(j, 2, diff);
        sum = diff;
      }
    }
  }
  return sum;
}

function changeArr(Arr, count, val, Nums) {
  let arr = [...Arr];
  let nums = [...Nums];


  if (count != 0) {
    let x = arr.pop() + val;
    arr.push(x);
    nums.pop();
  }
  else {
    arr.push(val);
  }
  return [arr, count + 1, nums];
}

function addNegative(operatorsArr, numsArr) {
  let arr1 = [...operatorsArr], arr2 = [...numsArr];

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] == '-') {
      arr2[i+1] = -arr2[i+1];
    }
  }
  return arr2;
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "0",
      display: "",
      atFirst: false,
      performed: false,
      operatorCount: 0,
      dotCount: 0,
      numsArr: [],
      ops: []
    }
    this.displayValue = this.displayValue.bind(this);
  }

  displayValue(val) {
    if (!this.state.atFirst) {
      this.state.input = "";
      this.state.display = ""
    }
    this.state.atFirst = true;

    if (this.state.input === '+' || this.state.input === '-' || this.state.input === '*' || this.state.input === '/') {
      this.state.input = "";
    }

    switch (val) {
      case '+':
      case '-':
      case '*':
      case '/':
        this.state.numsArr.push(Number(this.state.input));
        
        let isZero = this.state.numsArr[0]
        if(isZero == '0')
        {
          this.setState({
            display: val,
            input: val,
            dotCount: 0,
            performed: false,
          })

          let [a, b, c] = changeArr([], 0, val, []);
          this.setState({ ops: a, operatorCount: b, numsArr: c });
        }
        else{
          if (this.state.performed) {
            this.setState({
              display: this.state.numsArr[0] + ' ' + val + ' ',
              input: val,
              dotCount: 0,
              performed: false
            })
          }
          else {
            this.setState({
              display: this.state.display + " " + val + " ",
              input: val,
              dotCount: 0
            })
          }

          let [a, b, c] = changeArr(this.state.ops, this.state.operatorCount, val, this.state.numsArr);
          this.setState({ ops: a, operatorCount: b, numsArr: c });

          this.setState({
            operatorCount: this.state.operatorCount + 1
          })
        }

        break;
        

      case '.':
        if (this.state.dotCount < 1) {
          this.setState({
            input: this.state.input + val,
            display: this.state.display + val,
            dotCount: 1
          })
        }
        break;

      case '=':
        this.state.numsArr.push(Number(this.state.input));

        let arr1 = [...this.state.ops], arr2 = [...this.state.numsArr];
        if(this.state.ops.length === this.state.numsArr.length)
        { 
          if(arr1[0] === '+' || arr1[0] === '-')
          {
            arr2[0] = Number(arr1[0] + arr2[0]);
          }

          if(arr1[0] === '*' || arr1[0] === '/')
          {
            this.state.performed = true;
            this.setState({ops: arr1, numsArr: arr2});
          }
          else if(arr1[0] === '+' || arr1[0] === '-'){
            this.setState({ops: arr1, numsArr: arr2});
            arr1.shift();
          }
          
        
        }
        
        let change = addNegative(arr1, arr2);
        

        if (this.state.numsArr.length !== 0) {
          let loopRuns = 2;
          let sum = change[0];
          let operators = [...arr1];
          let nums = [...change];

          let res = calculate(loopRuns, sum, operators, nums);
        
          if(!this.state.performed)
          {
            this.setState({
              input: res,
              display: this.state.display + " = " + res,
              numsArr: [],
              performed: true,
              ops: [],
              dotCount: 0
            })
          }
        }
        break;

      case 'clear':
        this.setState({ input: 0, display: "", atFirst: false,performed: false, dotCount: 0, numsArr: [], ops: [], operatorCount: 0 });
        break;

      default:
        
        if(this.state.performed)
        {
            if(this.state.input == '0')
            {
              this.setState({
                input: val,
                display: val,
                operatorCount: 0,
                performed: false
              })
            }
            else{
              this.setState({
                input: val,
                display: val,
                operatorCount: 0,
                performed: false
              })
            }
        }
        else{
          if (this.state.input == '0') {
            this.setState({
              input: val,
              display: val,
              operatorCount: 0
            })
          }
          else {
            this.setState({
              input: this.state.input + "" + val,
              display: this.state.display + "" + val,
              operatorCount: 0
            })
          }
        }
        break;
    }
  }



  render() {

    return (<div>
      <div id="app-body">
        <div id="app-container">
          <div id="displaybox">
            <div id='display0'>{this.state.display}</div>
            <div id="display">{this.state.input}</div>
          </div>
          <div id="btns-grid">


            <button class="nums btn" id="zero" onClick={() => this.displayValue(0)} >0</button>
            <button class="nums btn" id="one" onClick={() => this.displayValue(1)} >1</button>
            <button class="nums btn" id="two" onClick={() => this.displayValue(2)} >2</button>
            <button class="nums btn" id="three" onClick={() => this.displayValue(3)} >3</button>
            <button class="nums btn" id="four" onClick={() => this.displayValue(4)} >4</button>
            <button class="nums btn" id="five" onClick={() => this.displayValue(5)} >5</button>
            <button class="nums btn" id="six" onClick={() => this.displayValue(6)} >6</button>
            <button class="nums btn" id="seven" onClick={() => this.displayValue(7)} >7</button>
            <button class="nums btn" id="eight" onClick={() => this.displayValue(8)} >8</button>
            <button class="nums btn" id="nine" onClick={() => this.displayValue(9)} >9</button>
            <button class="special btn" id="equals" onClick={() => this.displayValue('=')} >=</button>
            <button class="operation btn" id="add" onClick={() => this.displayValue('+')} >+</button>
            <button class="operation btn" id="subtract" onClick={() => this.displayValue('-')} >-</button>
            <button class="operation btn" id="multiply" onClick={() => this.displayValue('*')} >x</button>
            <button class="operation btn" id="divide" onClick={() => this.displayValue('/')} >/</button>
            <button class="nums btn" id="decimal" onClick={() => this.displayValue('.')} >.</button>
            <button class="danger btn" id="clear" onClick={() => this.displayValue('clear')} >AC</button>
          </div>
        </div>
        <div id="author">
          <p>Designed and Coded By</p>
          <p>Pavankr401</p>
        </div>
      </div>
    </div>)
  }
}

export default Calculator;
