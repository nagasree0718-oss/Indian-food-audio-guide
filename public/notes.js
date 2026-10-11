// Built-in notes for every dish. Used by the server AND by the browser as a safety net,
// so a dish page can never fail because Gemini is busy or out of quota.
const NOTES = {
'Rajma Chawal': {
  about: 'Rajma chawal is red kidney beans simmered in a gravy of onion, tomato, ginger, garlic and warm spices, served over steamed rice. It is the everyday comfort meal of Punjabi and Delhi homes, and a classic Sunday lunch.',
  history: 'Kidney beans are native to the Americas and are believed to have reached India after the 16th century through global trade. Over time they were adopted into the cooking of Punjab, Delhi and Jammu, where rajma became a beloved staple.',
  benefits: ['Rich in plant protein and fibre, so it keeps you full for hours', 'A good source of iron, folate and potassium', 'Beans with rice together give a more complete set of amino acids', 'Slow-release carbohydrates help avoid sudden sugar spikes'],
  watchOut: 'Kidney beans must be soaked and boiled thoroughly, because raw or undercooked beans can upset the stomach. Go easy on butter and cream, and add a salad on the side.',
  funFact: 'Rajma chawal is often called the ultimate comfort food of North India.' },
'Palak Paneer': {
  about: 'Palak paneer is a smooth spinach purée cooked with garlic, ginger and spices, with soft cubes of paneer (fresh cottage cheese) folded in. It is usually eaten with roti, naan or rice.',
  history: 'Paneer and leafy-green curries are long-standing parts of Punjabi cooking. The creamy restaurant version of palak paneer became widely popular across India and abroad during the twentieth century.',
  benefits: ['Spinach provides iron, folate and vitamins A and K', 'Paneer adds protein and calcium for bones and muscles', 'Cooking spinach lightly keeps most of its nutrients', 'Filling and vegetarian without being heavy'],
  watchOut: 'Restaurant versions often use plenty of cream and butter, which adds saturated fat. People prone to kidney stones should not overdo spinach. Ask for less cream, or make it at home with a little oil.',
  funFact: 'In many Punjabi homes the same dish is called saag paneer, though saag can use other greens too.' },
'Sarson da Saag': {
  about: 'Sarson da saag is a slow-cooked dish of mustard greens, often with spinach or bathua, thickened with a little maize flour and finished with ghee. It is served with makki di roti and a spoon of white butter.',
  history: 'This is the signature winter dish of Punjab, tied closely to the mustard fields that bloom across the region. Families have cooked it for generations in large pots over slow heat.',
  benefits: ['Packed with vitamins A, C and K from the leafy greens', 'Good source of fibre, iron and calcium', 'Antioxidants from mustard greens support general health', 'Warming and nourishing in cold weather'],
  watchOut: 'The butter and ghee served with it can add up quickly. People with thyroid conditions should ask their doctor before eating large amounts of mustard greens regularly.',
  funFact: 'Traditionally the greens are simmered for hours on low heat, and the flavour gets better the next day.' },
'Tandoori Chicken': {
  about: 'Tandoori chicken is chicken marinated in yogurt, lemon and spices such as Kashmiri chilli, then roasted at high heat in a clay oven called a tandoor. The result is smoky, juicy and slightly charred.',
  history: 'Clay tandoor ovens are very old across Central and South Asia. The modern tandoori chicken is widely credited to Delhi restaurateurs after 1947, who made it famous across India and the world.',
  benefits: ['Very high in protein, which supports muscle and recovery', 'Roasted rather than deep-fried, so it is comparatively light', 'Yogurt marinade makes the meat tender and adds calcium', 'Low in carbohydrates'],
  watchOut: 'Some restaurants use artificial red colour and a lot of salt, and heavily charred parts are best eaten in moderation. Choose skinless pieces and squeeze lemon on top.',
  funFact: 'The vivid red traditionally comes from Kashmiri chilli, not from food dye.' },
'Dal Tadka': {
  about: 'Dal tadka is yellow lentils (usually toor or moong) cooked until soft, then topped with a sizzling tempering of ghee, cumin, garlic and dried red chilli. It is eaten with rice or roti.',
  history: 'Lentils are among the oldest crops cultivated in India, and the technique of tempering spices in hot fat is an ancient part of Indian cooking. Dal tadka became a favourite on North Indian menus.',
  benefits: ['Excellent plant protein and fibre', 'Rich in iron, folate and magnesium', 'Low glycaemic impact, so energy stays steady', 'Affordable, filling and easy to digest'],
  watchOut: 'The tempering can be heavy on ghee, and some people feel gassy after lentils. Use a lighter tadka and drink water through the day.',
  funFact: 'The sizzle of the tadka hitting the dal is considered the moment the dish comes alive.' },
'Chole Bhature': {
  about: 'Chole bhature pairs a spicy chickpea curry with bhatura, a large puffy bread made from fermented refined flour and deep-fried until golden. It is a famous brunch in Delhi and Punjab.',
  history: 'The dish is closely linked to Punjabi cooking and is commonly said to have spread through Delhi eateries after Partition, when Punjabi families brought their food traditions to the city.',
  benefits: ['Chickpeas supply protein, fibre, iron and manganese', 'The chole curry on its own is a nourishing dish', 'Spices such as cumin and coriander aid digestion', 'Very filling and energy-rich'],
  watchOut: 'Bhatura is deep-fried refined flour, which makes the whole plate high in fat and calories. Enjoy a small portion occasionally, or have the chole with a plain roti or kulcha instead.',
  funFact: 'A good bhatura puffs up like a balloon the moment it hits the hot oil.' },
'Butter Chicken': {
  about: 'Butter chicken, or murgh makhani, is tender tandoori chicken simmered in a silky sauce of tomatoes, butter, cream and mild spices. It is usually enjoyed with naan or rice.',
  history: 'It is widely believed to have been created in Delhi in the mid twentieth century by cooks who simmered leftover tandoori chicken in a tomato and butter gravy rather than wasting it.',
  benefits: ['Chicken provides high-quality protein', 'Tomatoes bring vitamin C and lycopene', 'Contains B vitamins and zinc from the chicken', 'Mild spice makes it popular with all ages'],
  watchOut: 'The butter and cream make it rich in saturated fat and calories, and restaurant portions are large. Share it, choose roti over naan, and add vegetables or salad.',
  funFact: 'The dish was born from the idea of not wasting leftover chicken.' },
'Aloo Paratha': {
  about: 'Aloo paratha is whole wheat flatbread stuffed with spiced mashed potato and cooked on a griddle with ghee. It is a hearty Punjabi breakfast, often served with curd, pickle and butter.',
  history: 'Stuffed flatbreads have a long history in North India. Potatoes arrived from the Americas through European traders, and the aloo-stuffed paratha grew into a breakfast favourite, especially in Punjab.',
  benefits: ['Whole wheat gives fibre and steady energy', 'Potatoes supply potassium and vitamin C', 'Served with curd, it adds protein and probiotics', 'Very satisfying, keeps you going through the morning'],
  watchOut: 'A lot of ghee or butter adds calories fast, and potato-heavy meals raise blood sugar quickly. Use little oil, keep to one or two, and pair it with curd and some vegetables.',
  funFact: 'Many Punjabi dhabas serve it topped with a generous spoon of white butter.' },
'Samosa': {
  about: 'A samosa is a crisp, deep-fried triangular pastry filled with spiced potatoes and peas. It is one of India\'s most loved street snacks, eaten with mint and tamarind chutney.',
  history: 'Similar filled pastries were known in medieval Central Asia and the Middle East and are believed to have travelled to India with traders and royal courts. Indian cooks later made the potato filling their own.',
  benefits: ['Gives quick energy for a long day', 'Peas add a little protein and fibre', 'Spices such as cumin and coriander aid digestion', 'A small samosa shared with friends is a simple joy'],
  watchOut: 'It is deep-fried in refined flour pastry, so it is high in fat and calories, and reused oil is unhealthy. Treat it as an occasional snack, or try a baked or air-fried version.',
  funFact: 'Versions of the samosa exist across Asia and Africa under names such as sambusa and sanbusak.' },
'Jalebi': {
  about: 'Jalebi is a sweet made by frying spirals of fermented batter until crisp, then soaking them in warm sugar syrup. It is bright orange, crunchy outside and juicy inside.',
  history: 'Jalebi is related to the Middle Eastern sweet zalabiya and is believed to have reached India through Persian-speaking traders and courts in the medieval period. It became a festival favourite across the country.',
  benefits: ['Provides quick energy', 'Part of festive and family traditions that bring people together', 'In some regions it is eaten with hot milk or curd', 'A very small portion satisfies a sweet craving'],
  watchOut: 'It is made of refined flour, deep-fried and soaked in sugar, so it is high in sugar and calories. People with diabetes or heart conditions should keep it to a rare, tiny treat.',
  funFact: 'In Gujarat, jalebi with crunchy fafda is a classic Sunday and festival breakfast.' },
'Idli': {
  about: 'Idli is a soft, round steamed cake made from fermented rice and urad dal batter. It is a daily breakfast in South India, served with sambar and coconut chutney.',
  history: 'Steamed fermented cakes have been described in old South Indian texts, and food historians continue to discuss their exact origin. Idli has long been the everyday breakfast of Tamil Nadu, Karnataka and beyond.',
  benefits: ['Steamed, not fried, so it is low in fat', 'Fermentation helps digestion and adds B vitamins', 'Urad dal contributes plant protein', 'Light on the stomach and good for all ages'],
  watchOut: 'It is mostly polished rice, so portions matter for people watching blood sugar. Pair it with sambar and vegetables, or try versions made with oats or millets.',
  funFact: 'A well-made idli is described as being as soft as a jasmine flower.' },
'Sambar': {
  about: 'Sambar is a tangy lentil and vegetable stew flavoured with tamarind and a special spice powder. It is eaten with idli, dosa, vada and rice across South India.',
  history: 'Sambar is strongly linked with Tamil cooking. A popular legend connects its name to a Maratha prince in Thanjavur, though historians treat the story with care. Today it is a pillar of South Indian meals.',
  benefits: ['Toor dal gives protein', 'Many vegetables add fibre and vitamins', 'Tamarind and spices bring antioxidants', 'Low in fat and very filling'],
  watchOut: 'It can be high in salt, and the tamarind may bother people with acid reflux. Load it with vegetables and keep the oil light.',
  funFact: 'Almost every South Indian family has its own sambar powder recipe.' },
'Pesarattu': {
  about: 'Pesarattu is a crisp, savoury crepe made from ground green gram (whole moong) with ginger and green chilli. It is a famous breakfast from Andhra Pradesh, served with ginger chutney.',
  history: 'Moong has been grown in India for thousands of years. Pesarattu is a signature of Andhra homes and hotels, and the filled version, upma pesarattu, is an Andhra classic.',
  benefits: ['High in plant protein and fibre', 'Low glycaemic impact keeps energy steady', 'Good source of iron and folate', 'No fermentation needed, and naturally vegan'],
  watchOut: 'Frying with too much oil adds calories, and the chilli can be hot for some. Use a non-stick pan with a little oil.',
  funFact: 'Pairing pesarattu with a spoon of upma inside is a beloved Andhra combination.' },
'Ragi Sangati': {
  about: 'Ragi sangati, also called ragi mudde, is a soft ball of cooked finger millet flour, eaten with a spicy curry or sambar-like saaru. It is a staple of Karnataka and parts of Andhra.',
  history: 'Finger millet has been grown in South India for thousands of years and fed farming communities through hard work. It is seeing a revival today as a healthy, traditional grain.',
  benefits: ['One of the best plant sources of calcium', 'Rich in fibre and iron', 'Slow-release carbohydrates help blood sugar control', 'Naturally gluten-free'],
  watchOut: 'Millets contain compounds that may affect people with thyroid problems or kidney stones when eaten in large amounts, so they should check with a doctor. Pair with plenty of vegetables.',
  funFact: 'Traditionally ragi mudde is swallowed in small bites rather than chewed.' },
'Rasam': {
  about: 'Rasam is a thin, peppery soup of tamarind, tomato, black pepper, cumin and garlic, finished with a tempering of mustard seeds and curry leaves. It is sipped or mixed with rice.',
  history: 'The name comes from the Tamil word for juice. Rasam is a Tamil Nadu favourite, and a pepper-water version is often said to have inspired the British dish mulligatawny during colonial times.',
  benefits: ['Pepper, cumin and garlic support digestion', 'Tomato gives vitamin C', 'Hydrating and comforting during colds', 'Very low in calories'],
  watchOut: 'The tamarind and spice can trigger acid reflux in some people, and packaged versions can be salty. Enjoy it warm in moderate amounts.',
  funFact: 'Many families call rasam the cure for a cold, and many serve it just before the curd rice.' },
'Curd Rice': {
  about: 'Curd rice is soft rice mixed with yogurt and tempered with mustard seeds, curry leaves and chilli. It is the cooling final course of a South Indian meal.',
  history: 'Known as thayir sadam in Tamil and daddojanam in temple tradition, curd rice has long been offered in temples and eaten at the end of meals to cool the body and settle the stomach.',
  benefits: ['Curd provides probiotics for gut health', 'Gentle, easy to digest and cooling', 'Adds calcium and some protein', 'Soothing when the stomach is upset'],
  watchOut: 'Use fresh curd, because sour or old curd upsets some stomachs, and people who are lactose intolerant should be careful. Add cucumber or pomegranate and keep the rice portion moderate.',
  funFact: 'In South India, a meal is not considered complete without a last bite of curd rice.' },
'Gongura Pachadi': {
  about: 'Gongura pachadi is a tangy, spicy chutney of roselle (gongura) leaves cooked with red chilli, garlic and spices. A spoonful with hot rice and ghee is pure Andhra comfort.',
  history: 'Gongura is deeply tied to the cuisine of Andhra Pradesh and Telangana, where it is often described as the soul of local cooking. It is used in chutneys, dals and meat curries.',
  benefits: ['Source of vitamin C, iron and folate', 'Leaves are rich in antioxidants', 'The sour taste stimulates the appetite', 'Adds fibre and bold flavour to simple meals'],
  watchOut: 'It is very spicy and salty, and the sourness can trouble people with acidity. Eat it as a small side, not as a main dish.',
  funFact: 'Gongura mutton, which cooks the same leaves with meat, is an Andhra celebration dish.' },
'Pulihora': {
  about: 'Pulihora is tangy tamarind rice tempered with mustard seeds, dried chillies, peanuts, curry leaves and turmeric. It is a favourite offering in temples and festivals of Andhra Pradesh.',
  history: 'Called puliyodharai in Tamil, this tamarind rice has been served as temple prasadam for generations. It stays fresh without refrigeration for a day, so it travels well.',
  benefits: ['Peanuts add protein and healthy fats', 'Turmeric and tamarind bring antioxidants', 'Good source of quick, lasting energy', 'Made with simple pantry ingredients'],
  watchOut: 'It can be heavy in oil and salt, and the tamarind may trouble people with reflux. Use less oil and try a version with brown rice.',
  funFact: 'Pulihora is a must-make dish on festivals such as Ugadi.' },
'Hyderabadi Biryani': {
  about: 'Hyderabadi biryani layers marinated meat (often goat or chicken) with fragrant basmati rice, saffron, mint and fried onions, then slow-cooks it in a sealed pot. The aroma when the lid lifts is legendary.',
  history: 'The dish is linked to the royal kitchens of the Nizams of Hyderabad, blending Mughal biryani traditions with local Deccan flavours over the centuries.',
  benefits: ['Protein from the meat supports muscles', 'Spices, mint and saffron add flavour and antioxidants', 'Eaten with raita, the yogurt adds cooling probiotics', 'A celebration of community and sharing'],
  watchOut: 'It is rich in oil or ghee and salt, and portions are often very large, which makes it calorie-heavy. Eat a smaller plate with raita and salad, and save it for special days.',
  funFact: 'The pot is traditionally sealed with dough so the steam stays inside, a method called dum.' },
'Medu Vada': {
  about: 'Medu vada is a crisp, doughnut-shaped fritter of ground urad dal, fluffy inside and golden outside. It is eaten with sambar and coconut chutney as a South Indian breakfast.',
  history: 'Vadas of lentil batter have been part of South Indian temple and household cooking for a very long time, and medu vada remains a breakfast classic in Tamil Nadu and Karnataka.',
  benefits: ['Urad dal gives protein, iron and magnesium', 'Naturally gluten-free', 'Black pepper and curry leaf add flavour and aid digestion', 'Filling in small amounts'],
  watchOut: 'It is deep-fried and soaks up oil, so it is high in fat and calories. Have one piece, not many, or use an air-fryer or appe pan.',
  funFact: 'The hole in the middle helps the vada cook evenly all the way through.' },
'Mysore Pak': {
  about: 'Mysore pak is a rich, fudge-like sweet made of gram flour, ghee and sugar. It melts in the mouth and is a festival favourite.',
  history: 'It is said to have been created in the kitchens of the Mysore Palace in the early twentieth century, and the sweet is now linked with the city of Mysore itself.',
  benefits: ['Gives quick energy', 'Gram flour contributes a little protein', 'A small piece is a satisfying festive treat', 'Made from only a handful of ingredients'],
  watchOut: 'It is extremely high in ghee and sugar, so a small piece is plenty. People with diabetes, heart disease or weight concerns should treat it as a rare indulgence.',
  funFact: 'The story says it started as an experiment that turned out so good it was named after the city.' },
'Punugulu': {
  about: 'Punugulu are golden, crisp fritters made by frying spoonfuls of idli or dosa batter. They are a popular Andhra and Telangana evening snack with peanut or ginger chutney.',
  history: 'This street snack is thought to have grown out of the practice of using leftover fermented batter, and it is now a favourite at roadside stalls across the Telugu states.',
  benefits: ['Fermented batter is gentler on digestion than many snacks', 'Rice and urad dal give energy and some protein', 'Chutneys with peanuts or ginger add flavour and nutrients', 'Comforting on a rainy evening'],
  watchOut: 'They are deep-fried, so they are high in oil and calories, and chutneys can be salty. Have a few, or make them in an appe pan with very little oil.',
  funFact: 'Punugulu are best eaten piping hot, straight from the pan.' }
};
if (typeof module !== 'undefined') module.exports = NOTES;
