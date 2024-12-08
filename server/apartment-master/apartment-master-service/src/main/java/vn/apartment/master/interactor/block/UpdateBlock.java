package vn.apartment.master.interactor.block;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.block.UpdateBlockDTO;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.mapper.BlockMapper;
import vn.apartment.master.service.BlockService;

@Interactor
public class UpdateBlock {

    @Autowired
    private BlockService blockService;

    @Autowired
    private BlockMapper blockMapper;

    @Transactional
    public void execute(UpdateBlockDTO blockDTO) {
        Block hadBlock = blockService.findBlockById(blockDTO.getBlockId());
        blockMapper.updateEntity(blockDTO, hadBlock);
        blockService.saveOrUpdate(hadBlock);
    }
}
