import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { dispatch: cartDispatch } = useContext(CartContext);
  const { wishlist, dispatch: wishlistDispatch } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res1 = await fetch('https://dummyjson.com/products/category/mens-shirts');
      const res2 = await fetch('https://dummyjson.com/products/category/womens-dresses');
      const data1 = await res1.json();
      const data2 = await res2.json();
      setProducts([...data1.products, ...data2.products]);
    } catch (err) {
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => {
    const isFav = wishlist.some(p => p.id === item.id);

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
          <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heart}
          onPress={() => wishlistDispatch({ type: 'TOGGLE_WISHLIST', payload: item })}
        >
          <AntDesign name={isFav ? 'heart' : 'hearto'} size={18} color="#ff4d4d" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.discount}>Up to {item.discountPercentage}% off</Text>

          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#facc15" />
            <Text style={styles.rating}> {item.rating} </Text>
            <Text style={styles.count}>({item.stock})</Text>
          </View>

          <View style={styles.tagsRow}>
            <Feather name="award" size={14} color="#777" />
            <Text style={styles.tagText}> Best Seller</Text>
            <Feather name="tag" size={14} color="#777" style={{ marginLeft: 10 }} />
            <Text style={styles.tagText}> Best Price</Text>
          </View>

          <Text style={styles.price}>${item.price}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => cartDispatch({ type: 'ADD_TO_CART', payload: item })}
          >
            <AntDesign name="shoppingcart" size={16} color="#fff" />
            <Text style={styles.buttonText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    width: '48%',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 4,
  },
  discount: {
    fontSize: 10,
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  title: {
    color: '#1e1e1e',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    color: '#facc15',
    fontWeight: 'bold',
    fontSize: 12,
  },
  count: {
    color: '#888',
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagText: {
    color: '#777',
    fontSize: 11,
    marginLeft: 2,
  },
  price: {
    color: '#1e1e1e',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3A0CA3',
    borderRadius: 6,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;
