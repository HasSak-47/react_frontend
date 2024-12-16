import React, { useEffect, useState } from 'react';
import './App.css';

type DBPurchase = {
	id  : number,
	desc: string,
	cost: number,
	prepay: number,
	client: number,
};

function PurchaseTable(purchases: DBPurchase[] | null){
	let ps :any = <tr />;

	if(purchases != null){
		ps = purchases.map(p  => {
			return <tr>
				<td> {p.id} </td>
				<td> {p.cost} </td>
				<td> {p.desc} </td>
			</tr>;
		});
	}
	return <table className='Purchase'>
		<tr>
			<th> ID </th>
			<th> Precio </th>
			<th> Desc </th>
			{ps}
		</tr>
	</table>;
}

function AddPurchase() {
	function add_purchase(e: React.SyntheticEvent) {
		e.preventDefault();
		console.log(e)
		const target = e.target as typeof e.target & {
			desc: {value: string},
			cost: {value: string},
		};

		const cost = Number.parseInt(target.cost.value);
		let bd = JSON.stringify({ cost: cost, desc: target.desc.value});
		console.log("body: ", bd);
		fetch('/api/v1/purchase/add', {
			method: 'POST',
      headers: { 'Content-Type': 'application/json' },
			body: bd,
		})
	}

	return (
			<form onSubmit={add_purchase}>
				precio: <input id="cost" type="number"/>
				descripcion: <input id="desc" type="text"/>
				<button type='submit'> submit </button>
			</form>
	);
}

function App() {
	const [purchases, setpurchases] = useState(PurchaseTable([]));


	// sure why not
	useEffect( () => {
	fetch('/api/v1/purchase/list', {method:'GET'})
			.then(r => r.json())
			.then(j => setpurchases(PurchaseTable( j as DBPurchase[] )))
	}, []);

	return (
		<div className="App">
			<div id="purchases"> {purchases} </div>
			<AddPurchase />
		</div>
	);
}

export default App;
