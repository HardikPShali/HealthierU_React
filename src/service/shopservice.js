import axios from 'axios';
//import { rawListeners } from 'process';
// import properties from '../properties';
//import Cookies from 'universal-cookie';
import LocalStorageService from '../util/LocalStorageService';




export const getShops = async () => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }
    var config = {
        method: 'get',
        url: '/api/shop-products',
        headers: headers,
    };

    return await axios(config).then(response => {
        //console.log(response.data)
        return response.data;
    })

}

export const getShop = async (id) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'get',
        url: '/api/shop-products/' + id,
        headers: headers,
    };

    return await axios(config).then(response => {
        //console.log(response.data)
        return response.data;
    })

}

export const deleteShop = async (id) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'DELETE',
        url: '/api/shop-products/' + id,
        headers: headers
    };

    return await axios(config).then(response => {
        return response;
    })

}
export const deleteSubCategoryProduct = async (id) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'DELETE',
        url: '/api/category-products/' + id,
        headers: headers
    };

    return await axios(config).then(response => {
        return response;
    })

}
export const deleteSubCategory = async (id) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'DELETE',
        url: '/api/shop-products-subcategory/' + id,
        headers: headers
    };

    return await axios(config).then(response => {
        return response;
    })

}

export const postShop = async (data) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    const methodType = data.get('id') ? 'PUT' : 'POST';
    const shopData = {
        "id": data.get('id'),
        "category": data.get('category'),
        "name": data.get('name'),
        "hasSubcategory": data.get('hasSubcategory'),
        "brand": data.get('brand'),
        "description": data.get('description'),
        "pictureUrl": data.get('pictureUrl'),
        "sku": data.get('sku'),
        "linkUrl": data.get('linkUrl'),
        "price": data.get('price'),
        "currency": data.get('currency')
    }


    var config = {
        method: methodType,
        url: '/api/shop-products',
        headers: headers,
        data: shopData
    };

    return await axios(config).then(response => {
        return response.data;
    })


}

export const getListOfSubCategoryAndProducts = async (categoryName) => {
    const payload = {
        method: 'get',
        url: `/api/shop-products?category=${categoryName}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    return await axios(payload).then(response => {
        return response.data;
    })
    // .catch(error => {
    //     if (error.response.status === 401) {
    //         checkAccessToken();
    //     }
    // })
}

export const getSingleProduct = async (productId) => {
    const payload = {
        method: 'get',
        url: `/api/category-products/${productId}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    return await axios(payload).then(response => {
        return response.data;
    })
}


export const getSubCategoryProducts = async (categoryId) => {
    const payload = {
        method: 'get',
        url: `/api/shop-products-subcategory/${categoryId}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    return await axios(payload).then(response => {
        return response.data;
    })
}

export const addSubCategoryProduct = async (categoryId, data) => {
    const productData = {
        id: data.get('id'),
        brand: data.get('brand'),
        currency: data.get('currency'),
        description: data.get('description'),
        linkUrl: data.get('linkUrl'),
        name: data.get('name'),
        pictureUrl: data.get('pictureUrl'),
        price: data.get('price'),
        shopProductSubCategoryId: parseInt(categoryId),
        sku: data.get('sku'),
    }
    const payload = {
        method: data.get('id') ? 'PUT' : 'POST',
        url: `/api/category-products`,
        data: productData,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const res = await axios(payload).then(response => {
        return response;
    });
    return res;
}

export const addSubCategory = async (id, data) => {
    const subCategoryData = {
        pictureUrl: data.get('pictureUrl'),
        shopproductId: parseInt(id),
        subCategoryName: data.get('subCategoryName'),
        subCategoryProductList: []
    }
    const payload = {
        method: 'post',
        url: `/api/shop-products-subcategory`,
        data: subCategoryData,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const res = await axios(payload).then(response => {
        return response;
    });
    return res;
}

export const updateSubCategory = async (subCatData, data) => {
    const subCategoryData = {
        id: data.get('id'),
        pictureUrl: data.get('pictureUrl'),
        shopproductId: parseInt(subCatData.shopproductId),
        subCategoryName: data.get('subCategoryName'),
        subCategoryProductList: subCatData.subCategoryProductList
    }
    const payload = {
        method: 'put',
        url: `/api/shop-products-subcategory`,
        data: subCategoryData,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const res = await axios(payload).then(response => {
        return response;
    });
    return res;
}

export const getSubCategory = async (id) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'get',
        url: '/api/shop-products-subcategory/' + id,
        headers: headers,
    };

    return await axios(config).then(response => {
        //console.log(response.data)
        return response.data;
    })

}