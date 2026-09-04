import { useState, useEffect } from 'react'
import { Plus, Calendar, User, MapPin, CheckCircle, XCircle } from 'lucide-react'
import './App.css'

const API_BASE = 'http://192.168.175.154:5000'

function App() {
  const [rooms, setRooms] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showBookForm, setShowBookForm] = useState(null)
  const [newRoom, setNewRoom] = useState({ room_name: '', capacity: '' })
  const [bookedBy, setBookedBy] = useState('')

  // GET all rooms
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE}/rooms`)
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // POST create room
  const handleCreateRoom = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_name: newRoom.room_name,
          capacity: parseInt(newRoom.capacity),
        }),
      })
      setNewRoom({ room_name: '', capacity: '' })
      setShowCreateForm(false)
      fetchRooms()
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  // POST book room
  const handleBookRoom = async (e, roomId) => {
    e.preventDefault()
    try {
      await fetch(`${API_BASE}/rooms/${roomId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booked_by: bookedBy,
        }),
      })
      setBookedBy('')
      setShowBookForm(null)
      fetchRooms()
    } catch (error) {
      console.error('Error booking room:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Room Reservation System</h1>
          <p className="text-gray-600">Manage and book meeting rooms</p>
        </header>

        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
          >
            <Plus size={20} />
            Add New Room
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Room</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  value={newRoom.room_name}
                  onChange={(e) => setNewRoom({ ...newRoom, room_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g., 183-1001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g., 20"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Room
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
                room.booked ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="text-indigo-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-800">{room.room_name}</h3>
                </div>
                {room.booked ? (
                  <XCircle className="text-red-500" size={24} />
                ) : (
                  <CheckCircle className="text-green-500" size={24} />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={18} />
                  <span>Capacity: {room.capacity} people</span>
                </div>
                {room.booked && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>Booked by: {room.booked_by}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                {room.booked ? (
                  <span className="inline-flex items-center gap-2 text-red-600 font-medium">
                    <XCircle size={18} />
                    Room Booked
                  </span>
                ) : showBookForm === room.id ? (
                  <form onSubmit={(e) => handleBookRoom(e, room.id)} className="space-y-3">
                    <input
                      type="text"
                      value={bookedBy}
                      onChange={(e) => setBookedBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                      placeholder="Your name"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Confirm Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookForm(null)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowBookForm(room.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} />
                    Book This Room
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms available. Create your first room!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
