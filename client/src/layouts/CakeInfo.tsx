import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import Related from './CakeList/Related';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
const CakeInfo = () => {
  const { id } = useParams();

  const [cakeDetail, setCakeDetail] = useState(Object);

  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedFlavor, setSelectedFlavor] = useState('Chanh dây');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const navigate = useNavigate();

  // fetch API
  const fetchCakeDetail = async (id: any) => {
    try {
      const response = await axios.get(`http://localhost:8000/get-details-cake/${id}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Add this function to abbreviate the flavor
  const abbreviateFlavor = (flavor: string): string => {
    const flavorAbbreviations: { [key: string]: string } = {
      'Chanh dây': 'CD',
      'Dâu tây': 'DT',
      Socola: 'Soco',
    };

    return flavorAbbreviations[flavor] || flavor;
  };

  // Add this function to calculate
  const calculateCakeID = () => {
    const abbreviated = abbreviateFlavor(selectedFlavor);
    return `${id}-${abbreviated}-${selectedSize}`;
  };

  const findCakeWithNewCakeID = (cakes: {}[], cakeID: string) => {
    if (!Array.isArray(cakes)) {
      console.error('cakes is not an array', cakes);
      return undefined; // or return a default value or throw an error based on your use case
    }
    return cakes.find((cake: any) => cake.cakeID === cakeID);
  };

  useEffect(() => {
    const getCakeDetail = async () => {
      const cakes = await fetchCakeDetail(id); // Pass the id to your fetch function

      const newCakeID = await calculateCakeID();

      const cakeNew = await findCakeWithNewCakeID(cakes, newCakeID);
      setCakeDetail(cakeNew);
    };
    getCakeDetail();
  }, [id, selectedSize, selectedFlavor]); // Add id,selectedSize, selectedFlavor as a dependency to useEffect

  const userInfo = sessionStorage.getItem('userInfo');

  const handleAddToCart = () => {
    if (!userInfo) {
      navigate('/login');
    }

    if (cakeDetail) {
      addToCart({
        id: cakeDetail.cakeID,
        name: cakeDetail.cakeName,
        price: Number(cakeDetail.price),
        size: selectedSize,
        flavor: selectedFlavor,
        quantity: selectedQuantity,
        image: cakeDetail.img_url,
      });
      setNotification(`${cakeDetail.cakeID} đã được thêm vào giỏ hàng.`);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavor(flavor);
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity < 1) {
      quantity = 1;
    }
    setSelectedQuantity(quantity);
  };

  if (!cakeDetail) {
    return <div>Cake not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col px-16 lg:flex-row">
        <div className="mb-8 lg:mb-0 lg:w-2/3 lg:pr-8">
          <div className="h-[80vh]">
            <img src={cakeDetail.img_url} alt={cakeDetail.cakeName} className="h-full w-full rounded-xl object-cover" />
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="font-sans text-3xl font-bold">{cakeDetail.cakeName}</div>
          <p className="mt-2 text-2xl font-semibold text-red-500">{Number(cakeDetail.price).toLocaleString()} VNĐ</p>
          <p className="mt-4">{cakeDetail.description}</p>
          <p className="mt-4 text-sm text-gray-600">Mã bánh: {cakeDetail.cakeID}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold">Nhân bánh:</p>
            <div className="mt-2 flex">
              <button
                className={`mr-2 rounded border px-4 py-2 ${selectedFlavor === 'Chanh dây' ? 'bg-primary-500 text-white' : ''}`}
                onClick={() => handleFlavorChange('Chanh dây')}
              >
                Chanh dây
              </button>
              <button
                className={`mr-2 rounded border px-4 py-2 ${selectedFlavor === 'Dâu tây' ? 'bg-primary-500 text-white' : ''}`}
                onClick={() => handleFlavorChange('Dâu tây')}
              >
                Dâu tây
              </button>
              <button
                className={`rounded border px-4 py-2 ${selectedFlavor === 'Socola' ? 'bg-primary-500 text-white' : ''}`}
                onClick={() => handleFlavorChange('Socola')}
              >
                Socola
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Kích thước:</p>
            <div className="mt-2 flex">
              <button
                className={`mr-2 rounded border px-4 py-2 ${selectedSize === 'S' ? 'bg-primary-500 text-white' : ''}`}
                onClick={() => handleSizeChange('S')}
              >
                S
              </button>
              <button
                className={`mr-2 rounded border px-4 py-2 ${selectedSize === 'M' ? 'bg-primary-500 text-white' : ''}`}
                onClick={() => handleSizeChange('M')}
              >
                M
              </button>
              <button
                className={`rounded border px-4 py-2 ${selectedSize === 'L' ? 'bg-primary-500 text-white' : ''}`}
                onClick={() => handleSizeChange('L')}
              >
                L
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Thông điệp:</p>
            <input type="text" placeholder="Nhập thông điệp cho bánh" className="mt-2 w-full rounded border p-2" />
          </div>

          <div className="mt-6 flex items-center">
            <button
              className="rounded border px-4 py-2 hover:bg-primary-500"
              onClick={() => handleQuantityChange(selectedQuantity - 1)}
            >
              -
            </button>
            <span className="mx-4">{selectedQuantity}</span>
            <button
              className="rounded border px-4 py-2 hover:bg-primary-500"
              onClick={() => handleQuantityChange(selectedQuantity + 1)}
            >
              +
            </button>
          </div>

          <Button onClick={handleAddToCart} className="mt-6 w-full">
            Thêm vào giỏ hàng
          </Button>

          {notification && <div className="mt-4 text-green-500">{notification}</div>}
        </div>
      </div>

      <Related />
    </div>
  );
};

export default CakeInfo;
