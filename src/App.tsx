import React, { ChangeEvent, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { request } from 'http';
import { RequestOptions } from 'https';

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


function SaleRow({name, price, count}: Sale){
	return (
	<tr>
		<td> <input defaultValue={name}/> </td>
		<td> <input defaultValue={price}/> </td>
		<td> <input defaultValue={count}/> </td>
		<td> <input defaultValue={price * count}/> </td>
	</tr>
	);
}

const sales : Sale[] = [];

enum InputState{
	SettingProduct,
	SettingPrice,
	SettingCount,
	AddProduct,
}

function Ticket(){
	const [results, setResults] = useState("");

	let ask_for = async (event : ChangeEvent) => {
		let target = event.target as HTMLInputElement;
		let r = await fetch(`/api/v1/product/search?name=${target.value}&total=10`, { method: "GET", });
		let prods : {product: Product, score: number}[]= (await r.json()).products;
		let best = prods[0].product.name;
		setResults(best);
		console.log(best);
	};

	return (
	<div>
		<table> <tbody>
			<tr>
				<th> name  </th>
				<th> price </th>
				<th> count </th>
				<th> total </th>
			</tr>
			<tr>
				<td> <input name="name"  id="name" onChange={ask_for}/>  </td>
				<td> <input name="price" id="price"/> </td>
				<td> <input name="count" id="count"/> </td>
				<td> <input name="total" id="total"/> </td>
			</tr>
		</tbody> </table>
		total
		<div id='total_cost'> 0 </div>
		<button> guardar </button>
		<div> best match : {results} </div>
	</div>);
}

function App() {
    return (
        <div className="App">
			<header>
				<button onClick={() => {
					let childs = document.getElementById('BOD')?.children!;
				}}> New Ticket </button>
				<button> Add Products </button>
				<button> Login </button>
				<button> Signin </button>
			</header>
			<Ticket />
        </div>
    );
}

export default App;
