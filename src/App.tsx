import { throws } from 'assert';
import React, { useEffect, useState } from 'react';
import './App.css';

type DBPurchase = {
	id  : number,
	desc: string,
	cost: number,
	prepay?: number,
	client?: number,
};



function App() {
	const [purchase, setpurhases] = useState<DBPurchase[]>([]);

	let update_table = async () => {
		try{
			const response = await fetch('/api/v1/purchase/list', {method:'GET'});
				if(!response.ok)
					setpurhases([]);
				else
					setpurhases(await response.json() || []) ;
		}
		catch(error){
			console.log(error)
		}
	};

	const PurchaseTable = ( {purchases} : {purchases: DBPurchase[]}) => {
		let ps = purchases.map(p  => {
			return <tr key={p.id}>
				<td > <button onClick={ _ => 
					fetch(`/api/v1/purchase/delete/${p.id}`, { method:'DELETE' }).then( _ => update_table())
				}> terminado </button> </td>
				<td className="m-1 p-1"> {p.id} </td>
				<td className="m-1 p-1"> {p.cost / 100.} </td>
				<td className="m-1 p-1"> {p.desc} </td>
			</tr>;
		});
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

	useEffect(() => { update_table() }, []);


	return (
		<div className="App">
			<PurchaseTable purchases={purchase} />
			<form onSubmit={e => {
				e.preventDefault();
				const target = e.target as typeof e.target & {
					desc: {value: string},
					cost: {value: string},
				};
				const cost = Number.parseFloat(target.cost.value);

				let bd = JSON.stringify({ cost: cost * 100, desc: target.desc.value});
				fetch('/api/v1/purchase/add', {
					method: 'POST',
			    headers: { 'Content-Type': 'application/json' },
					body: bd,
				}).then(_ => update_table());

				e.currentTarget.reset();
			}}>
				precio: <input id="cost" type="number" defaultValue={0} />
				descripcion: <input id="desc" type="text" defaultValue={""} />
				<button type='submit'> submit </button>
			</form>
		</div>
	);
}

export default App;
