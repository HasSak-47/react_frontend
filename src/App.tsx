import React, { useState } from 'react';
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


function Ticket(){
	const [results, setResults] = useState("");
	const [sales, setsales] = useState( <div />);
	const [totalCost, settotalCost] = useState(0);

	const products : Sale[]= [];
	let options : Product[] = [];

	let ask_for = async (event : React.KeyboardEvent<HTMLInputElement>) => {
		let target = event.target as HTMLInputElement;
		let r = await fetch(`/api/v1/product/search?name=${target.value}&total=10`, { method: "GET", });
		let prods : {product: Product, score: number}[]= (await r.json()).products;
		if(prods.length != 0){
			options = prods.map(k => { return k.product });
			setResults(options[0].name);
		}

		if(event.code == "Enter"){
			console.log(options[0].name);
			target.value = options[0].name
			let count = document.getElementById("count")! as HTMLInputElement;
			(document.getElementById("price")! as HTMLInputElement).value = (options[0].price / 100).toString();
			count.focus();
			count.value = "1"
			return;
		}
	};

	let process_price = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if(event.code == "Enter"){
		}
	}

	return (
	<div>
		<table> <tbody>
			<tr>
				<th> name  </th>
				<th> count </th>
				<th> price </th>
				<th> total </th>
			</tr>
				{ sales }
			<tr>
				<td> <input name="name"  id="name"  onKeyDown={ask_for}/>  </td>
				<td> <input name="count" id="count" onKeyDown={process_price} type="number"/> </td>
				<td> <input name="price" id="price" type="number"/> </td>
				<td> <input name="total" id="total" type="number"/> </td>
			</tr>
		</tbody> </table>
		total
		<div id='total_cost'> {totalCost} </div>
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
