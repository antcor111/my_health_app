const KEY_W = 'mh_weights'
const KEY_WO = 'mh_workouts'

function load(key){try{return JSON.parse(localStorage.getItem(key))||[]}catch(e){return[]}}
function save(key,data){localStorage.setItem(key,JSON.stringify(data))}

const weights = load(KEY_W)
const workouts = load(KEY_WO)

// Weight form
const weightForm = document.getElementById('weight-form')
const weightDate = document.getElementById('weight-date')
const weightValue = document.getElementById('weight-value')

weightForm.addEventListener('submit', e=>{
  e.preventDefault()
  const d = weightDate.value
  const v = parseFloat(weightValue.value)
  if(!d||isNaN(v))return
  weights.push({date:d,value:v})
  save(KEY_W,weights)
  weightForm.reset()
  renderChart()
})

// Workouts
const workoutForm = document.getElementById('workout-form')
const workoutList = document.getElementById('workout-list')
workoutForm.addEventListener('submit', e=>{
  e.preventDefault()
  const d = document.getElementById('workout-date').value
  const t = document.getElementById('workout-type').value.trim()
  const dur = parseInt(document.getElementById('workout-duration').value,10)
  const intensity = document.getElementById('workout-intensity').value
  if(!d||!t||isNaN(dur))return
  workouts.push({date:d,type:t,duration:dur,intensity})
  save(KEY_WO,workouts)
  workoutForm.reset()
  renderWorkouts()
})

function renderWorkouts(){
  workoutList.innerHTML = ''
  workouts.slice().reverse().forEach((w,idx)=>{
    const li = document.createElement('li')
    li.textContent = `${w.date} — ${w.type} • ${w.duration}min • ${w.intensity}`
    workoutList.appendChild(li)
  })
}

// Chart
let chart = null
function renderChart(){
  const ctx = document.getElementById('weight-chart').getContext('2d')
  const sorted = weights.slice().sort((a,b)=>new Date(a.date)-new Date(b.date))
  const labels = sorted.map(r=>r.date)
  const data = sorted.map(r=>r.value)
  if(chart)chart.destroy()
  chart = new Chart(ctx,{type:'line',data:{labels, datasets:[{label:'Weight',data,fill:false,borderColor:'#2b7cff',tension:0.2}]},options:{responsive:true,plugins:{legend:{display:false}}}})
}

// Init
renderChart()
renderWorkouts()
