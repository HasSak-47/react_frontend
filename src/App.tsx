import { throws } from 'assert';
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
				<td > <button> terminado </button> </td>
				<td className="m-1 p-1"> {p.id} </td>
				<td className="m-1 p-1"> {p.cost / 100.} </td>
				<td className="m-1 p-1"> {p.desc} </td>
			</tr>;
		});
	}
	return <table className='Purchase'>
		<tr className="bg-blue-300">
			<th />
			<th> ID </th>
			<th> Precio </th>
			<th className="w-96"> Desc </th>
		</tr>
		{ps}
	</table>;
}

function App() {
	const [purchases, setpurchases] = useState(PurchaseTable([]));

	function update_table(){
		fetch('/api/v1/purchase/list', {method:'GET'})
			.then(r => {
				if(r.ok)
					return r.json();
				return Promise.reject(new Error("err"));
			})
			.then(j => {
				setpurchases(PurchaseTable( j as DBPurchase[] ))
			})
	}

	function add_purchase(e: React.SyntheticEvent) {
		e.preventDefault();

		const target = e.target as typeof e.target & {
			desc: {value: string},
			cost: {value: string},
		};

		const cost = Number.parseFloat(target.cost.value);
		let bd = JSON.stringify({ cost: cost, desc: target.desc.value});
		fetch('/api/v1/purchase/add', {
			method: 'POST',
      headers: { 'Content-Type': 'application/json' },
			body: bd,
		})

		update_table()
	}


	// sure why not
	useEffect( () => {
		update_table()
	}, []);

	return (
		<div className="App">
			<div id="purchases"> {purchases} </div>
			<form onSubmit={add_purchase}>
				precio: <input id="cost" type="number"/>
				descripcion: <input id="desc" type="text"/>
				<button type='submit'> submit </button>
			</form>
		</div>
	);
}

export default App;
