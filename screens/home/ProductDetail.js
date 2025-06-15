import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import { AntDesign } from '@expo/vector-icons';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { dispatch } = useContext(CartContext);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const fetchRelated = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/products/category/${product.category}`);
      const data = await res.json();
      const filtered = data.products.filter(p => p.id !== product.id);
      setRelatedProducts(filtered.slice(0, 5));
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelated();
  }, []);

  const renderRecommendation = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.push('ProductDetail', { product: item })}
      style={styles.recommendCard}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.recommendImage} />
      <Text numberOfLines={1} style={styles.recommendTitle}>{item.title}</Text>
      <Text style={styles.recommendPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.wrapper}>
      {message !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}

      <Image source={{ uri: product.thumbnail }} style={styles.productImage} />

      {/* TITLE + CATEGORY */}
      <View style={styles.headerBlock}>
        <Text style={styles.titleLeft}>{product.title}</Text>
        <Text style={styles.categoryRight}>{product.category.toUpperCase()}</Text>
      </View>

      {/* PRICE + DISCOUNT */}
      <View style={styles.rowBlock}>
        <Text style={styles.priceText}>$ {product.price}</Text>
        <Text style={styles.discountText}>{product.discountPercentage}% OFF</Text>
      </View>

      {/* RATING */}
      <View style={styles.ratingBlock}>
        <AntDesign name="star" size={16} color="#facc15" />
        <Text style={styles.ratingText}> {product.rating} / 5</Text>
      </View>

      {/* DESCRIPTION BOX */}
      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionTitle}>Product Description</Text>
        <Text style={styles.descriptionText}>{product.description}</Text>
      </View>

      {/* CART BUTTON */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => {
          dispatch({ type: 'ADD_TO_CART', payload: product });
          showMessage('Added to cart');
        }}
      >
        <AntDesign name="shoppingcart" size={18} color="#fff" />
        <Text style={styles.cartButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toast: {
    backgroundColor: '#28a745',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  titleLeft: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryRight: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  rowBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A0CA3',
  },
  discountText: {
    fontSize: 14,
    color: '#ef4444',
  },
  ratingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 10,
  },
  ratingText: {
    marginLeft: 6,
    color: '#555',
    fontSize: 14,
  },
  descriptionBox: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#3A0CA3',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  cartButton: {
    flexDirection: 'row',
    backgroundColor: '#3A0CA3',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 20,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recommendHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  recommendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: 140,
    marginRight: 12,
    elevation: 3,
    alignItems: 'center',
  },
  recommendImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  recommendPrice: {
    fontSize: 13,
    color: '#3A0CA3',
    fontWeight: '500',
  },
});

export default ProductDetail;
