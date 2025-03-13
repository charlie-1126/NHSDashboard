export function Main() {
  const items = [
    {
      name: '갤럭시 버즈3 프로',
      dateAcquired: '2025-03-13',
      location: '2-4',
      disposalDate: '2025-03-27',
    },
    {
      name: '아이폰 15',
      dateAcquired: '2025-03-10',
      location: '3-2',
      disposalDate: '2025-03-25',
    },
  ];

  return (
    <div className='Main'>
      <div className='LNF'>
        <h1>LNF</h1>
        <div className='LNF_container'>
          {items.map((item, index) => (
            <li key={index}>
              <img src={item.path} alt={item.name} />
              <div>
                <span>{item.name}</span>
                <span>취득일: {item.dateAcquired}</span>
                <span>취득 장소: {item.location}</span>
                <span>폐기 일시: {item.disposalDate}</span>
              </div>
            </li>
          ))}
        </div>
      </div>
      <div className='NMS'>
        <h1>Meal</h1>
        <div className='NMS_container'>
          <h2>조식</h2>
          <div className='MealData'>
            <li>쌀밥</li>
            <li>쌀밥</li>
            <li>쌀밥</li>
            <li>쌀밥</li>
          </div>
        </div>
      </div>
    </div>
  );
}
