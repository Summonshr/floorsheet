import React, {useState} from "react";
import "./style.css";
import {sortBy, countBy, map} from 'lodash';
export default function App() {
  let current = '';
  let combined  = {
    symbol: '',
    quantity: 0,
    amount: 0,
    name: '',
    attempt: 0,
    rate: 0
  };
  let stack = []

  let [data,setData] = useState({floorsheets: {content: []}})

  sortBy(data.floorsheets.content,'id').map(a=>{
    if(a.stockSymbol !== current && combined.symbol != '') {
      stack.push(combined)
      combined = {
        symbol: '',
        quantity: 0,
        name:'',
        amount: 0,
        attempt: 0,
        rate: 0
      }
    }
  
    current = a.stockSymbol
    combined.symbol = a.stockSymbol
    combined.quantity += a.contractQuantity
    combined.amount += a.contractAmount
    combined.name = a.securityName;
    combined.attempt = combined.attempt + 1
    combined.name = a.securityName
    combined.rate = a.contractRate > combined.rate ? a.contractRate : combined.rate
  
  });
  stack.push(combined)
  stack = stack.filter(a=>a.quantity > 1000 || a.amount > 400000 )

  
  return (
    <div class="flex flex-wrap justify-around max-w-6xl mx-auto w-full">
      <div class="w-full px-2 py-2"> <input className="w-full p-2 border border-gray-400 bg-gray-300 shadow" value={JSON.stringify(data)} onChange={e=>setData(JSON.parse(e.target.value))}/></div> 
      {data.floorsheets && <>
      <div class="w-1/3"><table>
        <thead>
          <tr>
            <th  className=" border p-2">Symbol</th>
            <th  className=" border p-2">Count</th>
          </tr>
        </thead>
        <tbody>
          {map(countBy(stack,'symbol'), (value, prop) => ({ prop, value })).filter(a=>a.value>3).map(a=>
          <tr>
            <td  className=" border p-2">{a.prop}</td>
            <td  className=" border p-2">{a.value}</td>
          </tr>)}
        </tbody>
      </table></div>
      <div className="w-2/3 h-screen overflow-y-scroll"><table>
      <thead>
        <tr>
          <th className=" border p-2">Symbol</th>
          <th className=" border p-2">Name</th>
          <th className=" border p-2">Quantity</th>
          <th className=" border p-2">Amount</th>
          <th className=" border p-2">Rate</th>
          <th className=" border p-2">Attempt</th>
        </tr>
      </thead>
      <tbody>
        {stack.map(t=><tr class={(t.amount > 1000000 || t.quantity > 10000 || t.attempt > 10 ? ' bg-green-200 ' : '')}>
          <td className=" border p-2">{t.symbol}</td>
          <td className="border p-2">{t.name}</td>
          <td className=" border p-2 text-right" >{t.quantity.toLocaleString()}</td>
          <td className=" border p-2" >{t.amount.toLocaleString()}</td>
          <td className="border p-2 text-right ">{t.rate}</td>
          <td className="border p-2 text-right">{t.attempt}</td>
        </tr>)}
      </tbody>
    </table></div></>}
    </div> 
  );
}
