// ═══════════════════════════════════════
// data.js — App Data & Constants
// ═══════════════════════════════════════

const ROLES = {
  admin:       { label: 'Систем Админ', name: 'Г.Батболд', initial: 'Г', accent: '#7C3AED', accentLight: '#F5F3FF' },
  manager:     { label: 'Менежер',      name: 'Н.Сарнай',  initial: 'Н', accent: '#2563EB', accentLight: '#EFF4FF' },
  electrician: { label: 'Цахилгаанчин', name: 'Д.Мөнх',   initial: 'Д', accent: '#059669', accentLight: '#ECFDF5' },
  customer:    { label: 'Хэрэглэгч',   name: 'О.Анар',   initial: 'О', accent: '#D97706', accentLight: '#FFFBEB' },
};

const ORDERS = [
  { id:'#4821', customer:'О.Анар',     issue:'Гэрийн цахилгаан тасарсан',  location:'3-р хороо, 14-р байр, 51-р тоот', date:'2026-04-14', time:'10:00', electrician:'Д.Мөнх',   elecInitial:'Д', status:'active',    price:45000, method:'QPay' },
  { id:'#4820', customer:'Б.Болд',     issue:'Залгуур 3ш солих',            location:'7-р хороо, 22-р байр, 8-р тоот',  date:'2026-04-14', time:'14:00', electrician:'Б.Ганхүү', elecInitial:'Б', status:'pending',   price:null,  method:null },
  { id:'#4819', customer:'Т.Батзул',   issue:'LED гэрэл суулгах',           location:'5-р хороо, 3-р байр, 17-р тоот', date:'2026-04-13', time:'09:00', electrician:'Э.Эрдэнэ', elecInitial:'Э', status:'done',      price:65000, method:'Карт' },
  { id:'#4818', customer:'Д.Уянга',    issue:'Тоолуур шалгуулах',           location:'2-р хороо, 9-р байр, 4-р тоот',  date:'2026-04-12', time:'11:00', electrician:'Д.Мөнх',   elecInitial:'Д', status:'done',      price:30000, method:'QPay' },
  { id:'#4817', customer:'Г.Нармандах',issue:'Утас үнэртэж байна',          location:'1-р хороо, 5-р байр, 33-р тоот', date:'2026-04-11', time:'15:00', electrician:'—',         elecInitial:'?', status:'cancelled', price:null,  method:null },
  { id:'#4816', customer:'Б.Энхтуяа',  issue:'Унтраалга солих',             location:'4-р хороо, 11-р байр, 2-р тоот', date:'2026-04-10', time:'13:00', electrician:'Б.Ганхүү', elecInitial:'Б', status:'done',      price:25000, method:'Интернет банк' },
];

const EMPLOYEES = [
  { id:'EMP-001', name:'Д.Мөнх',    role:'Цахилгаанчин', phone:'99887766', email:'monkh@dscts.mn',    status:'busy', jobs:12, rating:4.8, initial:'Д', color:'#059669' },
  { id:'EMP-002', name:'Б.Ганхүү',  role:'Цахилгаанчин', phone:'88997766', email:'ganhuu@dscts.mn',   status:'free', jobs:9,  rating:4.5, initial:'Б', color:'#2563EB' },
  { id:'EMP-003', name:'Э.Эрдэнэ',  role:'Цахилгаанчин', phone:'91112233', email:'erdene@dscts.mn',   status:'free', jobs:7,  rating:4.2, initial:'Э', color:'#7C3AED' },
  { id:'EMP-004', name:'Н.Сарнай',  role:'Менежер',       phone:'96667788', email:'narantuya@dscts.mn',status:'busy', jobs:0,  rating:null, initial:'Н', color:'#D97706' },
  { id:'EMP-005', name:'Г.Батболд', role:'Систем Админ',  phone:'94445566', email:'admin@dscts.mn',    status:'free', jobs:0,  rating:null, initial:'Г', color:'#DC2626' },
];

const MY_ORDERS = [
  { id:'#4821', issue:'Гэрийн цахилгаан тасарсан', location:'3-р хороо, 14-р байр, 51-р тоот', date:'2026-04-14', time:'10:00', electrician:'Д.Мөнх',  status:'active', price:45000, progress:60 },
  { id:'#4818', issue:'Залгуур 3ш солих',           location:'3-р хороо, 14-р байр, 51-р тоот', date:'2026-04-07', time:'09:00', electrician:'Б.Ганхүү',status:'done',   price:45000, progress:100 },
  { id:'#4812', issue:'Унтраалга солих',             location:'3-р хороо, 14-р байр, 51-р тоот', date:'2026-04-02', time:'15:00', electrician:'Д.Мөнх',  status:'done',   price:25000, progress:100 },
];

let ADMIN_STATS = { users: 0, products: 0, categories: 0, orders: 0, revenue: 0 };
let ADMIN_PRODUCTS = [];
let ADMIN_CATEGORIES = [];
let ADMIN_ORDERS = [];
let ADMIN_PAYMENT_INFO = null;
