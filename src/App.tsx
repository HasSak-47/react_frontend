import React, { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import './App.css';

interface Product{
	id: number,
	name: string,
	price: number,
	count: number,
	cost: number,
}

interface Sale{
	name: string,
	price: number,
	count: number,
}

async function get_best(query: string, count: number){
	let r = await fetch(`/api/v1/product/search?name=${query}&total=${count}`, { method: "GET", });
	let prods : {product: Product, score: number}[]= (await r.json()).products;
	return prods;
}

async function get_price(name: string){
	let r = await fetch(`/api/v1/product/search_exact/${name}`, { method: "GET", });
	if(r.status != 200){
		return 0;
	}
	let prods : {product: Product, score: number}= (await r.json()).products;
	return prods.product.price;
}

type State = 'name' | 'count' | 'price' | 'total'
let c_state : State = 'name';

interface CProduct {
	name : null | string,
	price: null | number,
	count: null | number,
	total: null | number,
}

function nextState(e: React.KeyboardEvent) {
	if(e.key != 'Enter'){
		return;
	}

	let next : State = 'name';
	switch (c_state){
		case 'name':
			next = 'count';
			break;
		case 'count':
			next = 'price';
			break;
		case 'price':
			next = 'total';
			break;
	}
	c_state = next;
	document.getElementById(c_state)?.focus();
}

function Ticket(){
	const [options, setoptions] = useState(<datalist id="products-list"/>);
	const name_change = (e: React.ChangeEvent) => {
		let val = (e.target as HTMLInputElement).value;
		get_best(val, 10).then(best => {
			let names = best.map(p => <option> {p.product.name} </option>);
			setoptions(<datalist id="products-list"> {names} </datalist>)
			let val = (e.target as HTMLInputElement).value;
			let price = document.getElementById('price') as HTMLInputElement;
			get_price(val).then(v => price.value = String(v)).catch();
		});
	}
	const count_change = () => { }
	const price_change = () => { }
	const total_change = () => { }

	return (
	<div>
		{ options }
		<table> <tbody>
			<tr>
				<th> name  </th>
				<th> count </th>
				<th> price </th>
				<th> total </th>
			</tr>
			<tr>
				<td> <input name="name"  id="name" onChange={name_change}   onKeyUp={nextState} list="products-list" onFocus={() => c_state = 'name'}/> </td>
				<td> <input name="count" id="count" onChange={count_change} onKeyUp={nextState} type="number" onFocus={() => c_state = 'count'}/> </td>
				<td> <input name="price" id="price" onChange={price_change} onKeyUp={nextState} type="number" onFocus={() => c_state = 'price'}/> </td>
				<td> <input name="total" id="total" onChange={total_change} onKeyUp={nextState} type="number" onFocus={() => c_state = 'total'}/> </td>
			</tr>
		</tbody> </table>
	</div>);
}

function App() {
	return (
		<div className="App">
			<Ticket />
		</div>
	);
}

export default App;
