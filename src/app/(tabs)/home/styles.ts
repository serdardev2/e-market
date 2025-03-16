import { Colors } from '@/src/constants/Colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerView: {
    backgroundColor: Colors.common.primary,
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 22,
    color: Colors.common.white,
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  list: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '48%',
  },
  productImage: {
    width: '100%',
    height: 100,
    marginTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.common.primary,
  },
  searchContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emptySearchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptySearchText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 12,
  },
  clearSearchButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.common.primary,
    borderRadius: 8,
  },
  clearSearchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
