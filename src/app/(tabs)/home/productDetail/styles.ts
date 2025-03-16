import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/src/constants/Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 40,
  },
  imageContainer: {
    width: '100%',
    height: width * 0.7,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.common.primary,
    marginBottom: 16,
  },
  actionContainer: {
    marginBottom: 24,
  },
  addToCartButton: {
    width: '100%',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  specificationContainer: {
    marginBottom: 24,
  },
  specificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  specificationRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  specLabel: {
    width: '40%',
    fontSize: 16,
    color: '#666',
  },
  specValue: {
    width: '60%',
    fontSize: 16,
    color: '#333',
  },
});
