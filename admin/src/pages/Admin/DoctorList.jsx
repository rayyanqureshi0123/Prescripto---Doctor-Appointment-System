import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {

  const { doctors, aToken, getAllDoctors,changeAvailability  } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pb-1.5'>
        {
          doctors.map((item, index) => (
            <div
              className='border border-gray-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white hover:shadow-md transition'
              key={index}
            >
              {/* Image exactly like your original */}
              <img
                className='bg-indigo-50 group-hover:bg-[#5f6FFF] transition-all duration-500'
                src={item.image}
                alt={item.name}
              />

              {/* Doctor details */}
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>

                {/* Availability checkbox (styled like your screenshot) */}
                <div className='mt-2 flex items-center gap-2 text-sm'>
                  <input
                    onChange={()=>changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    readOnly
                    className="accent-blue-600"
                  />
                  <p className="text-gray-700">Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorList
