import React, { useState } from 'react';
import axios from 'axios';
import Loading from './Loading';

const Nav = () => {
    const [products, setProducts] = useState(null);
    const [products2, setProducts2] = useState(null);
    const [sortKey, setSortKey] = useState(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function getProducts() {
        if (!text) return;
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`https://api.github.com/users/${text}`);
            setProducts(res.data);
            const res2 = await axios.get(`https://api.github.com/users/${text}/repos`);
            setProducts2(res2.data);
        } catch (err) {
            setError('');
            setProducts(null);
            setProducts2(null);
        } finally {
            setLoading(false);
        }
    }

    const sortedRepos = products2 ? [...products2].sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortKey === 'date') return new Date(b.created_at) - new Date(a.created_at);
        return 0;
    }) : [];

    return (
        <>
            <nav className="nav">
                <div className="container">
                    <h1 className="nav_title">GitHub Finder</h1>
                </div>
            </nav>
            <main className="main">
                <div className="container">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            getProducts();
                            setText('');
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Введите имя пользователя"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button className="btn" type="submit">НАЙТИ</button>
                    </form>
                    {loading && <Loading />}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {products && (
                        <div className="intro">
                            <div className="intro_box">
                                <div className="intro_box_left">
                                    <img src={products.avatar_url} alt="" className="image" />
                                    <button className="button" onClick={() => window.open(products.html_url, '_blank')}>ПОСЕТИТЬ</button>
                                </div>
                                <div className="intro_box_right">
                                    <h3 className="intro_text">{products.login}</h3>
                                    <h3 className="intro_text">Репозиториев: {products.public_repos}</h3>
                                    <h3 className="intro_text">Создан: {new Date(products.created_at).toLocaleDateString()}</h3>
                                    <h3 className="intro_text">Подписчиков: {products.followers}</h3>
                                    <h3 className="intro_text">Подписок: {products.following}</h3>
                                </div>
                            </div>
                            <h2 className="title">Сортировка</h2>
                            <div className="intro_bottom">
                                <button className="btn_name1" onClick={() => setSortKey('name')}>ИМЯ</button>
                                <button className="btn_name2" onClick={() => setSortKey('stars')}>ЗВЕЗДЫ</button>
                                <button className="btn_name3" onClick={() => setSortKey('date')}>ДАТА</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <footer className="footer">
                <div className="containerr">
                    <div className="list">
                        <div className="list_box">
                            {products2 ? (
                                sortedRepos.map((product) => (
                                    <div className="list_card" key={product.id}>
                                        <div className="list_card_left">
                                            <h2 className="list_title">
                                                <a
                                                    href={product.homepage || '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {product.name}
                                                </a>
                                            </h2>
                                            <p className="list_text">Кол-во звёзд: {product.stargazers_count}</p>
                                            <p className="list_text">Дата добавления: {new Date(product.created_at).toLocaleDateString()}</p>
                                            <p className="list_text">Язык: {product.language}</p>
                                        </div>
                                        <div className="list_card_right">
                                            <button className="button" onClick={() => window.open(product.html_url, '_blank')}>ПОСЕТИТЬ</button>
                                        </div>
                                    </div>
                                ))
                            ) : products ? (
                                <Loading />
                            ) : null}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Nav;
