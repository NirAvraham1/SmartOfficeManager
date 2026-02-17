import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';
import { Button, TextField, Box, Pagination } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default observer(function DashboardPage() {
    const { assetStore, authStore } = useStore();
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('');

    useEffect(() => {
        assetStore.loadAssets();
    }, [assetStore]);

    const handleCreate = async () => {
        if (!newName || !newType) return;
        await assetStore.createAsset({ name: newName, type: newType });
        setNewName('');
        setNewType(''); 
    };

    return (
        <div className="bg-[#f6f6f8] h-screen w-screen flex text-slate-800 font-['Inter'] overflow-hidden fixed inset-0">
            
            {/* Sidebar */}
            <aside className="w-64 bg-[#1a227f] flex-shrink-0 flex flex-col shadow-xl text-white h-full">
                <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
                    <span className="material-icons text-2xl text-indigo-200">domain</span>
                    <span className="font-bold text-lg tracking-tight">OfficeOS</span>
                </div>
                <nav className="flex-1 py-6 px-3 space-y-1">
                    <p className="px-3 text-xs font-semibold text-indigo-300 uppercase mb-4 tracking-widest text-left">Management</p>
                    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/10 shadow-inner">
                        <span className="material-icons text-indigo-200">devices_other</span>
                        <span className="font-medium text-sm text-left">Asset Registry</span>
                    </div>
                </nav>
                <div className="p-4 border-t border-white/10 bg-black/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-indigo-300 flex items-center justify-center font-bold">
                            {authStore.user?.username[0].toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-semibold truncate text-white">{authStore.user?.username}</p>
                            <p className="text-[10px] uppercase font-bold text-indigo-200">{authStore.user?.role}</p>
                        </div>
                        <button onClick={() => authStore.logout()} className="text-indigo-300 hover:text-white">
                            <span className="material-icons text-xl">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-[#1a227f] material-icons">apartment</span>
                        Infrastructure <span className="text-slate-400 font-normal text-sm">/ Resources</span>
                    </h2>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#f6f6f8]">
                    
                    {/* Admin Action Bar */}
                    {authStore.isAdmin && (
                        <Box className="bg-white rounded-xl p-6 border border-indigo-100 shadow-xl flex items-center justify-between gap-6">
                            <div className="flex flex-1 gap-4 items-center">
                                <div className="p-3 bg-indigo-50 rounded-lg hidden sm:block">
                                    <AddCircleOutlineIcon sx={{ color: '#1a227f' }} />
                                </div>
                                <TextField 
                                    fullWidth
                                    label="Asset Name"
                                    size="small"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                                <TextField 
                                    fullWidth
                                    label="Category (Free Text)"
                                    size="small"
                                    value={newType}
                                    onChange={e => setNewType(e.target.value)}
                                />
                                <Button 
                                    variant="contained"
                                    onClick={handleCreate}
                                    disabled={!newName || !newType}
                                    sx={{ backgroundColor: '#1a227f', height: '40px', px: 4, fontWeight: 'bold' }}
                                >
                                    CREATE
                                </Button>
                            </div>
                        </Box>
                    )}

                    {/* Resources Grid */}
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest text-left">Active Inventory</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
                            {assetStore.assets.map((asset, index) => (
                                <div key={asset.id || index} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 transition-colors">
                                            <span className="material-icons-outlined text-slate-400 group-hover:text-white">
                                                {asset.type.toLowerCase().includes('room') ? 'meeting_room' : 
                                                 asset.type.toLowerCase().includes('elect') ? 'power' : 'desk'}
                                            </span>
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase">Online</span>
                                    </div>
                                    <h5 className="text-slate-900 font-extrabold text-base mb-1 text-left">{asset.name}</h5>
                                    <p className="text-slate-400 text-[11px] font-medium mb-6 italic text-left">{asset.type}</p>
                                    <Button 
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{ borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}
                                    >
                                        VIEW DETAILS
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* שלב 2 סעיף 3: הוספת רכיב הדפדוף (Pagination) בתחתית ה-Grid */}
                        <div className="flex justify-center mt-12 mb-8">
                            <Pagination 
                                count={Math.ceil(assetStore.totalCount / assetStore.pageSize)} 
                                page={assetStore.currentPage} 
                                onChange={(_, page) => assetStore.setPage(page)}
                                color="primary"
                                size="large"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
});