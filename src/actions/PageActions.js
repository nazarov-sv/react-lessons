import {
    GET_PHOTOS_REQUEST,
    GET_PHOTOS_FAIL,
    GET_PHOTOS_SUCCESS
} from '../constants/Page'

let photosArr = []
let cached = false

function makeYearPhotos(photos, selectedYear) {
    let createdYear, yearPhotos = []
    photos.forEach((item) => {
        createdYear = new Date(item.date*1000).getFullYear()
        console.log(createdYear)
        if (createdYear === selectedYear ) {
            yearPhotos.push(item)
        }
    })
    yearPhotos.sort((a,b) => b.likes.count-a.likes.count);
    return yearPhotos
}
function getMorePhotos(offset, count, year, dispatch) {
    window.VK.Api.call('photos.getAll', {v:5.52,extended:1, count: count, offset: offset},(r) => {
        try {
            if (offset <= r.response.count - count) {
                offset+=200;
                photosArr = photosArr.concat(r.response.items)
                getMorePhotos(offset,count,year,dispatch)
            }
            else if(0 === offset && r.response.count > 0){
                let photos = makeYearPhotos(r.response.items, year);
                dispatch({
                    type: GET_PHOTOS_SUCCESS,
                    payload: photos
                })
            }
            else {
                let photos = makeYearPhotos(photosArr, year)
                cached = true
                dispatch({
                    type: GET_PHOTOS_SUCCESS,
                    payload: photos
                })
            }
        }
        catch(e) {
            dispatch({
                type: GET_PHOTOS_FAIL,
                error: true,
                payload: new Error(e)
            })
        }
    })
}
export function getPhotos(year) {
    return (dispatch) => {
        dispatch({
            type: GET_PHOTOS_REQUEST,
            payload: year
        })
        if (cached) {
            let photos = makeYearPhotos(photosArr, year)
            dispatch({
                type: GET_PHOTOS_SUCCESS,
                payload: photos
            })
        } else {
            getMorePhotos(0,200,year,dispatch)
        }
    }
}