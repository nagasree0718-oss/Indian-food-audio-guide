// n = name, e = emoji fallback, r = region, s = state, h = health, w = Wikipedia article title (for real photographs)
const FOODS = [
  // North India
  {n:'Rajma Chawal',e:'🫘',r:'North',s:'Punjab / Delhi',h:'healthy',w:'Rajma'},
  {n:'Palak Paneer',e:'🥬',r:'North',s:'Punjab',h:'healthy',w:'Palak paneer'},
  {n:'Sarson da Saag',e:'🌿',r:'North',s:'Punjab',h:'healthy',w:'Sarson da saag'},
  {n:'Tandoori Chicken',e:'🍗',r:'North',s:'Punjab',h:'healthy',w:'Tandoori chicken'},
  {n:'Dal Tadka',e:'🍲',r:'North',s:'Pan-North',h:'healthy',w:'Dal tadka'},
  {n:'Chole Bhature',e:'🥘',r:'North',s:'Punjab / Delhi',h:'unhealthy',w:'Chole bhature'},
  {n:'Butter Chicken',e:'🍛',r:'North',s:'Delhi',h:'unhealthy',w:'Butter chicken'},
  {n:'Aloo Paratha',e:'🫓',r:'North',s:'Punjab',h:'unhealthy',w:'Aloo paratha'},
  {n:'Samosa',e:'🥟',r:'North',s:'Uttar Pradesh',h:'unhealthy',w:'Samosa'},
  {n:'Jalebi',e:'🍥',r:'North',s:'Pan-North',h:'unhealthy',w:'Jalebi'},
  // South India
  {n:'Idli',e:'⚪',r:'South',s:'Tamil Nadu / Karnataka',h:'healthy',w:'Idli'},
  {n:'Sambar',e:'🥣',r:'South',s:'Tamil Nadu',h:'healthy',w:'Sambar (dish)'},
  {n:'Pesarattu',e:'🥞',r:'South',s:'Andhra Pradesh',h:'healthy',w:'Pesarattu'},
  {n:'Ragi Sangati',e:'🟤',r:'South',s:'Karnataka / Andhra',h:'healthy',w:'Ragi mudde'},
  {n:'Rasam',e:'🍅',r:'South',s:'Tamil Nadu',h:'healthy',w:'Rasam'},
  {n:'Curd Rice',e:'🍚',r:'South',s:'Tamil Nadu',h:'healthy',w:'Curd rice'},
  {n:'Gongura Pachadi',e:'🍃',r:'South',s:'Andhra Pradesh',h:'healthy',w:'Gongura'},
  {n:'Pulihora',e:'🍋',r:'South',s:'Andhra Pradesh',h:'healthy',w:'Pulihora'},
  {n:'Hyderabadi Biryani',e:'🍲',r:'South',s:'Telangana',h:'unhealthy',w:'Hyderabadi biryani'},
  {n:'Medu Vada',e:'🍩',r:'South',s:'Tamil Nadu / Karnataka',h:'unhealthy',w:'Medu vada'},
  {n:'Mysore Pak',e:'🟨',r:'South',s:'Karnataka',h:'unhealthy',w:'Mysore pak'},
  {n:'Punugulu',e:'🧆',r:'South',s:'Andhra Pradesh',h:'unhealthy',w:'Punugulu'}
];
if (typeof module !== 'undefined') module.exports = FOODS;
