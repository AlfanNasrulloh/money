import React, { useEffect, useState } from 'react'

const SectionContent = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [keValue, setKeValue] = useState('')
	const [modalInput, setModalInput] = useState('')
	const [lInput, setLInput] = useState('')
	const [prInput, setPrInput] = useState('')
	const [items, setItems] = useState([])
	const [editIndex, setEditIndex] = useState(null)
	const [targetInput, setTargetInput] = useState('')

	// Load data from localStorage on mount
	useEffect(() => {
		const storedItems = localStorage.getItem('items')
		if (storedItems) {
			const parsedItems = JSON.parse(storedItems)
			const updatedItems = parsedItems.map((item) => ({
				...item,
				modal: Number(item.modal),
				l: Number(item.l),
				pr: Number(item.pr),
			}))
			setItems(updatedItems)
		}
	}, [])

	// Save data to localStorage every time items change
	useEffect(() => {
		if (items.length > 0) {
			localStorage.setItem('items', JSON.stringify(items))
		}
	}, [items])

	const toggleModal = () => setIsModalOpen(!isModalOpen)
	const closeModal = () => {
		setEditIndex(null) // Reset edit index when closing modal
		setIsModalOpen(false)
	}

	// Function to calculate total
	const calculateTotal = (modal, pr, l) => {
		return Number(modal) + Number(pr) - Number(l)
	}

	// Calculate progress percentage (0 to 100)
	const calculateProgress = (modal, pr, l, target) => {
		const total = calculateTotal(modal, pr, l)
		return total && target ? Math.min((total / target) * 100, 100) : 0
	}

	// Submit data
	const handleSubmit = () => {
		const newItem = {
			ke: keValue,
			modal: modalInput,
			l: lInput,
			pr: prInput,
			target: targetInput, // Add target to new item
		}

		// If there are existing items, the next modal will be the total of the last item
		if (items.length > 0) {
			const lastItem = items[items.length - 1]
			const newModal = calculateTotal(lastItem.modal, lastItem.pr, lastItem.l)
			newItem.modal = newModal // Update modal of new item

			// Set the target to the same as the first item if it's not the first item
			if (!targetInput) {
				newItem.target = items[0].target // Take target from the first item if not provided
			}
		}

		// If editing, update the existing item
		if (editIndex !== null) {
			const updatedItems = [...items]
			updatedItems[editIndex] = newItem
			setItems(updatedItems)
		} else {
			setItems([...items, newItem])
		}

		// Reset inputs
		setKeValue('')
		setModalInput('')
		setLInput('')
		setPrInput('')
		setTargetInput('')
		closeModal()
	}

	const handleEdit = (index) => {
		const itemToEdit = items[index]
		setKeValue(itemToEdit.ke)
		setModalInput(itemToEdit.modal)
		setLInput(itemToEdit.l)
		setPrInput(itemToEdit.pr)
		setEditIndex(index)
		setTargetInput(itemToEdit.target || '')
		toggleModal() // Open the modal for editing
	}

	const handleDelete = (index) => {
		const updatedItems = items.filter((_, i) => i !== index)
		setItems(updatedItems)
	}

	return (
		<div className='flex flex-col items-center justify-center p-6'>
			<div className='mt-6 w-full max-w-md'>
				<div className='p-6 rounded-lg shadow-xl bg-gray-700'>
					<div className='text-center mb-6'>
						<h3 className='text-3xl font-semibold text-white mb-2'>
							ENJOY PROFIT!!
						</h3>
						<p className='text-lg text-white'>RELAXED BUT SURE!!</p>
					</div>

					<div className='flex justify-between items-center mb-4'>
						{/* Progress Section (on the left) */}
						<div className='flex items-center'>
							<p className='text-white mr-2'>Target 💸 : </p>
							{items.length > 0 && items[items.length - 1].target ? (
								<div className='flex items-center'>
									<progress
										className='progress progress-primary w-30' // Tailwind width: `w-48` (for 12rem)
										value={calculateProgress(
											items[items.length - 1].modal,
											items[items.length - 1].pr,
											items[items.length - 1].l,
											items[items.length - 1].target
										)}
										max='100'
									></progress>
									<p className='text-white text-xs mr-2'>
										{calculateProgress(
											items[items.length - 1].modal,
											items[items.length - 1].pr,
											items[items.length - 1].l,
											items[items.length - 1].target
										).toFixed(2)}
										%
									</p>
								</div>
							) : (
								<p className='text-white ml-4'>Target not set</p>
							)}
						</div>

						{/* Add Button (on the right) */}
						<button
							className='btn btn-accent text-white font-bold py-2 px-4 rounded-lg shadow-md hover:scale-105'
							onClick={toggleModal}
						>
							Add
						</button>
					</div>

					<div className='mt-6 w-full max-w-md'>
						{items.length > 0 && (
							<div className='space-y-4'>
								{items.map((item, index) => (
									<div
										key={index}
										className='p-4 rounded-lg shadow-lg bg-gray-800'
									>
										<p className='text-white'>Trade Ke - {index + 1}</p>
										<p className='text-white'>
											💰 Modal : Rp{' '}
											{new Intl.NumberFormat('id-ID').format(item.modal)}
										</p>
										<p className='text-white'>
											⛔ Lose : Rp{' '}
											{new Intl.NumberFormat('id-ID').format(item.l)}
										</p>
										<p className='text-white'>
											💹 Profit : Rp{' '}
											{new Intl.NumberFormat('id-ID').format(item.pr)}
										</p>
										<p className='text-white'>
											💰 Total : Rp{' '}
											{new Intl.NumberFormat('id-ID').format(
												Number(item.modal) + Number(item.pr) - Number(item.l)
											)}
										</p>
										<p className='text-white'>
											🎯 Target : Rp{' '}
											{new Intl.NumberFormat('id-ID').format(item.target || 0)}
										</p>

										<div className='flex gap-2 mt-4'>
											<button
												className='btn btn-warning text-white font-bold py-1 px-3 rounded-lg'
												onClick={() => handleEdit(index)}
											>
												Edit
											</button>
											<button
												className='btn btn-error text-white font-bold py-1 px-3 rounded-lg'
												onClick={() => handleDelete(index)}
											>
												Delete
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
					<div className='modal modal-open'>
						<div className='modal-box relative w-85 max-w-md p-6 bg-gray-700 rounded-lg shadow-xl'>
							<button
								className='btn btn-sm btn-circle absolute right-2 top-2'
								onClick={closeModal}
							>
								✕
							</button>
							<h2 className='text-xl font-semibold mb-4 text-white'>
								{editIndex !== null ? 'Edit Item' : 'Input Form'}
							</h2>
							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-white'>
										💰 Modal :
									</label>
									{editIndex !== null || items.length === 0 ? (
										<input
											type='number'
											className='input input-bordered w-full mt-1'
											value={modalInput}
											onChange={(e) => setModalInput(e.target.value)}
										/>
									) : (
										<p className='text-white'>
											{new Intl.NumberFormat('id-ID').format(modalInput)}
										</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-white'>
										⛔ Lose :
									</label>
									<input
										type='number'
										className='input input-bordered w-full mt-1'
										value={lInput}
										onChange={(e) => setLInput(e.target.value)}
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-white'>
										💹 Profit :
									</label>
									<input
										type='number'
										className='input input-bordered w-full mt-1'
										value={prInput}
										onChange={(e) => setPrInput(e.target.value)}
									/>
								</div>

								{/* Target input, logic has changed here */}
								<div>
									<label className='block text-sm font-medium text-white'>
										🎯 Target :
									</label>
									{items.length > 0 ? (
										<p className='text-white'>
											{new Intl.NumberFormat('id-ID').format(items[0].target)}
										</p>
									) : (
										<input
											type='number'
											className='input input-bordered w-full mt-1'
											value={targetInput}
											onChange={(e) => setTargetInput(e.target.value)}
										/>
									)}
								</div>

								<div className='mt-6 text-center'>
									<button
										className='btn btn-primary w-full'
										onClick={handleSubmit}
									>
										{editIndex !== null ? 'Update' : 'Submit'}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default SectionContent
