import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Page extends Component {
    onYearBtnClick(e) {
        this.props.getPhotos(+e.target.innerText)
    }
    render() {
        const { year, photos, fetching, error } = this.props
        const years = [2018,2017,2016,2015,2014,2013,2012,2011]
        return <div className='ib page'>
            <p>
                { years.map((item,index) => <button className='btn' key={index} onClick={this.onYearBtnClick.bind(this)}>{item}</button> )}
            </p>
            <h3>{year} год [{photos.length}]</h3>
            { error ? <p className='error'> Во время загрузки фото произошла ошибка</p> : ''
            }
            {
                fetching ?
                    <p>Загрузка...</p>
                    :
                    photos.map((entry, index) =>
                        <div key={index} className='photo'>
                            <p><img src={entry.photo_130} /></p>
                            <p>{entry.likes.count} ❤</p>
                        </div>
                    )
            }
        </div>
    }
}
Page.propTypes = {
    year: PropTypes.number.isRequired,
    photos: PropTypes.array.isRequired,
    getPhotos: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired
}