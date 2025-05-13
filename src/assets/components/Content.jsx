import React, { useState, useEffect } from 'react'
// wooii
const Content = ({ setModalData }) => {
	const [isOpen, setIsOpen] = useState(false) // State untuk modal terbuka/tutup
	const [modalValue, setModalValue] = useState('') // State untuk input modal
	const [targetValue, setTargetValue] = useState('') // State untuk input target
	const [submittedData, setSubmittedData] = useState(null) // State untuk menyimpan data yang disubmit

	// Fungsi untuk membuka modal
	const openModal = () => setIsOpen(true)

	// Fungsi untuk menutup modal
	const closeModal = () => setIsOpen(false)

	// Fungsi untuk menangani submit
	const handleSubmit = () => {
		const data = { modal: modalValue, target: targetValue }
		// Simpan data ke localStorage
		localStorage.setItem('submittedData', JSON.stringify(data))
		setSubmittedData(data) // Update state
		setModalValue('') // Reset input
		setTargetValue('') // Reset input
		closeModal() // Close modal after submit
		// Mengirim data ke parent component atau ke SectionContent
		setModalData(data) // Kirim data ke SectionContent
	}

	// Mengambil data dari localStorage saat komponen pertama kali dimuat
	useEffect(() => {
		const storedData = localStorage.getItem('submittedData')
		if (storedData) {
			setSubmittedData(JSON.parse(storedData))
		}
	}, [])

	const handleReset = () => {
		localStorage.removeItem('submittedData')
		setSubmittedData(null)
		closeModal()
	}

	const formatRupiah = (number) => {
		if (!number) return 'Rp. 0'
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
		}).format(number)
	}

	return (
		<div className='flex flex-col items-center justify-center p-6'>
			{/* Card untuk Menampilkan Data Setelah Submit */}
			<div className='mt-6 w-full max-w-md'>
				<div className='flex justify-end gap-2 mb-4'>
					<button
						className='btn btn-accent text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
						onClick={openModal}
					>
						Edit
					</button>
					<button
						className='btn btn-error text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
						onClick={handleReset}
					>
						Reset
					</button>
				</div>

				<div className='p-6 rounded-lg shadow-xl bg-gray-700'>
					<h3 className='text-xl font-semibold mb-4 text-white flex items-center justify-center'>
						RELAXED BUT SURE!!
					</h3>
					<ul className='space-y-4'>
						<li className='flex justify-between items-center'>
							<strong className='text-sm font-medium text-white w-1/3'>
								Modal 💰:
							</strong>
							<span className='text-sm text-white w-2/3'>
								{submittedData
									? formatRupiah(submittedData.modal)
									: 'Not record'}
							</span>
						</li>
						<li className='flex justify-between items-center'>
							<strong className='text-sm font-medium text-white w-1/3'>
								Target 💸:
							</strong>
							<span className='text-sm text-white w-2/3'>
								{submittedData
									? formatRupiah(submittedData.target)
									: 'Not record'}
							</span>
						</li>
					</ul>
				</div>
			</div>

			{/* Card Modal */}
			{isOpen && (
				<div className='fixed inset-0 flex items-center justify-center z-50'>
					<div className='modal modal-open'>
						<div className='modal-box relative w-85 max-w-md p-6 bg-gray-700 rounded-lg shadow-xl'>
							<button
								className='btn btn-sm btn-circle absolute right-2 top-2'
								onClick={closeModal}
							>
								✕
							</button>
							<h2 className='text-xl font-semibold mb-4'>Input Form</h2>
							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-white'>
										Modal All 💰 :
									</label>
									<input
										type='number'
										className='input input-bordered w-full mt-1'
										placeholder='Enter something...'
										value={modalValue}
										onChange={(e) => setModalValue(e.target.value)}
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-white'>
										Go to Target 💸 :
									</label>
									<input
										type='number'
										className='input input-bordered w-full mt-1'
										placeholder='Enter something...'
										value={targetValue}
										onChange={(e) => setTargetValue(e.target.value)}
									/>
								</div>
								<div className='mt-6 text-center'>
									<button
										className='btn btn-primary w-full'
										onClick={handleSubmit}
									>
										Submit
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

export default Content
